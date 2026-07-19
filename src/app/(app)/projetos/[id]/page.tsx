import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CircuitBoard, Ruler, FileText, ListChecks, Calculator, ArrowUpRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { TitleBlock } from '@/components/TitleBlock';
import type { Project } from '@/types/database.types';

const STATUS_LABEL: Record<string, string> = {
  rascunho: 'Rascunho',
  em_andamento: 'Em andamento',
  em_revisao: 'Em revisão',
  concluido: 'Concluído',
  arquivado: 'Arquivado',
};

export default async function ProjetoDetalhePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();
  const project = data as Project | null;

  if (!project) notFound();

  const modules = [
    { href: `/diagramas?projeto=${project.id}`, label: 'Diagramas', icon: CircuitBoard, desc: 'Unifilares, trifilares e plantas' },
    { href: `/dimensionamento?projeto=${project.id}`, label: 'Dimensionamento', icon: Ruler, desc: 'Condutores, disjuntores, quedas de tensão' },
    { href: `/calculadoras?projeto=${project.id}`, label: 'Calculadoras', icon: Calculator, desc: 'Demanda, iluminação, curto-circuito' },
    { href: `/documentacao?projeto=${project.id}`, label: 'Documentação', icon: FileText, desc: 'Memoriais, ART, laudos' },
    { href: `/gestao?projeto=${project.id}`, label: 'Gestão', icon: ListChecks, desc: 'Cronograma e tarefas' },
  ];

  return (
    <div>
      <TitleBlock
        title={project.name}
        subtitle={project.client_name ?? undefined}
        projectCode={project.id.slice(0, 8).toUpperCase()}
        revision="A"
        status={STATUS_LABEL[project.status] ?? project.status}
      />

      <div className="p-8">
        <div className="mb-8 grid grid-cols-2 gap-4 rounded-sm border border-base-700 bg-base-950 p-5 sm:grid-cols-4">
          <Field label="Tensão de entrada" value={project.voltage_supply ?? '—'} />
          <Field label="Endereço" value={project.address ?? '—'} />
          <Field label="Criado em" value={new Date(project.created_at).toLocaleDateString('pt-BR')} />
          <Field label="Atualizado em" value={new Date(project.updated_at).toLocaleDateString('pt-BR')} />
        </div>

        {project.description && (
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-ink-400">{project.description}</p>
        )}

        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-700">Módulos do projeto</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className="focus-ring group flex items-start justify-between rounded-sm border border-base-700 bg-base-950 p-4 transition-colors hover:border-base-600"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-copper-600/30 bg-copper-600/10">
                    <Icon size={15} className="text-copper-400" />
                  </div>
                  <div>
                    <p className="text-[13.5px] text-ink-100">{m.label}</p>
                    <p className="mt-0.5 text-[12px] text-ink-500">{m.desc}</p>
                  </div>
                </div>
                <ArrowUpRight size={14} className="mt-1 text-ink-700 group-hover:text-copper-400" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-700">{label}</p>
      <p className="text-[13.5px] text-ink-200">{value}</p>
    </div>
  );
}
