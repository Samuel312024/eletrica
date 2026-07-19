import Link from 'next/link';
import { Plus, FolderKanban, MapPin } from 'lucide-react';
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

export default async function ProjetosPage() {
  const supabase = createClient();
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, client_name, address, status, voltage_supply, cover_color, updated_at')
    .order('updated_at', { ascending: false })
    .returns<
      Pick<
        Project,
        'id' | 'name' | 'client_name' | 'address' | 'status' | 'voltage_supply' | 'cover_color' | 'updated_at'
      >[]
    >();

  return (
    <div>
      <TitleBlock
        title="Projetos"
        subtitle="Todos os projetos elétricos da sua conta"
        action={
          <Link
            href="/projetos/novo"
            className="focus-ring flex items-center gap-1.5 rounded-sm bg-copper-600 px-3.5 py-2 text-[13px] font-medium text-base-950 hover:bg-copper-500"
          >
            <Plus size={14} /> Novo projeto
          </Link>
        }
      />

      <div className="p-8">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projetos/${p.id}`}
                className="focus-ring group rounded-sm border border-base-700 bg-base-950 p-4 transition-colors hover:border-base-600"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-sm"
                    style={{ backgroundColor: `${p.cover_color ?? '#C87F3D'}22` }}
                  >
                    <FolderKanban size={15} style={{ color: p.cover_color ?? '#C87F3D' }} />
                  </div>
                  <span className="rounded-sm border border-base-600 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
                <h3 className="font-display text-[15px] font-500 text-ink-100 group-hover:text-copper-400">
                  {p.name}
                </h3>
                {p.client_name && <p className="mt-0.5 text-[13px] text-ink-500">{p.client_name}</p>}
                {p.address && (
                  <p className="mt-2 flex items-center gap-1 text-[12px] text-ink-700">
                    <MapPin size={11} /> {p.address}
                  </p>
                )}
                {p.voltage_supply && (
                  <p className="mt-2 font-mono text-[11px] text-ink-700">{p.voltage_supply}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-base-700 py-16 text-center">
            <FolderKanban size={22} className="mx-auto mb-3 text-ink-700" />
            <p className="text-sm text-ink-500">Você ainda não tem nenhum projeto.</p>
            <Link
              href="/projetos/novo"
              className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-copper-600 px-3.5 py-2 text-[13px] font-medium text-base-950 hover:bg-copper-500"
            >
              <Plus size={14} /> Criar primeiro projeto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
