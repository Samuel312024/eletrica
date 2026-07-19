import Link from 'next/link';
import { FolderKanban, CircuitBoard, Ruler, Sparkles, ArrowRight, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { TitleBlock } from '@/components/TitleBlock';
import type { Profile, Project } from '@/types/database.types';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id ?? '')
    .single();
  const profile = profileData as Pick<Profile, 'full_name'> | null;

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, client_name, status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)
    .returns<Pick<Project, 'id' | 'name' | 'client_name' | 'status' | 'updated_at'>[]>();

  const firstName = profile?.full_name?.split(' ')[0] ?? 'engenheiro(a)';

  const quickLinks = [
    { href: '/projetos/novo', label: 'Novo projeto', icon: Plus, tone: 'copper' as const },
    { href: '/diagramas', label: 'Abrir diagramas', icon: CircuitBoard, tone: 'default' as const },
    { href: '/dimensionamento', label: 'Dimensionamento', icon: Ruler, tone: 'default' as const },
    { href: '/assistente-ia', label: 'Perguntar à IA', icon: Sparkles, tone: 'default' as const },
  ];

  return (
    <div>
      <TitleBlock title={`Olá, ${firstName}`} subtitle="Visão geral da sua operação de engenharia elétrica" />

      <div className="p-8">
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.tone === 'copper'
                    ? 'focus-ring flex items-center gap-2.5 rounded-sm border border-copper-600/40 bg-copper-600/10 px-4 py-3.5 text-sm text-copper-400 transition-colors hover:bg-copper-600/15'
                    : 'focus-ring flex items-center gap-2.5 rounded-sm border border-base-700 bg-base-950 px-4 py-3.5 text-sm text-ink-300 transition-colors hover:border-base-600 hover:text-ink-100'
                }
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="rounded-sm border border-base-700 bg-base-950">
          <div className="flex items-center justify-between border-b border-base-700 px-5 py-3.5">
            <h2 className="font-display text-sm font-500 text-ink-100">Projetos recentes</h2>
            <Link href="/projetos" className="flex items-center gap-1 text-[13px] text-copper-400 hover:text-copper-300">
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>

          {projects && projects.length > 0 ? (
            <ul className="divide-y divide-base-700">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projetos/${p.id}`}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-base-900"
                  >
                    <div className="flex items-center gap-3">
                      <FolderKanban size={16} className="text-ink-700" />
                      <div>
                        <p className="text-[13.5px] text-ink-100">{p.name}</p>
                        {p.client_name && <p className="text-[12px] text-ink-500">{p.client_name}</p>}
                      </div>
                    </div>
                    <span className="rounded-sm border border-base-600 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                      {p.status?.replace('_', ' ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-ink-500">Nenhum projeto ainda.</p>
              <Link
                href="/projetos/novo"
                className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-copper-600 px-3.5 py-2 text-[13px] font-medium text-base-950 hover:bg-copper-500"
              >
                <Plus size={14} /> Criar primeiro projeto
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
