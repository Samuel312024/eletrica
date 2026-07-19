'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FolderKanban,
  CircuitBoard,
  Ruler,
  BookOpen,
  Calculator,
  FileText,
  Cpu,
  ListChecks,
  GraduationCap,
  Sparkles,
  Zap,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Visão geral',
    items: [{ href: '/dashboard', label: 'Painel', icon: LayoutDashboard }],
  },
  {
    label: 'Projeto',
    items: [
      { href: '/projetos', label: 'Projetos', icon: FolderKanban },
      { href: '/diagramas', label: 'Diagramas', icon: CircuitBoard },
      { href: '/dimensionamento', label: 'Dimensionamento', icon: Ruler },
      { href: '/calculadoras', label: 'Calculadoras', icon: Calculator },
      { href: '/documentacao', label: 'Documentação', icon: FileText },
    ],
  },
  {
    label: 'Operação',
    items: [
      { href: '/automacao', label: 'Automação', icon: Cpu },
      { href: '/gestao', label: 'Gestão', icon: ListChecks },
      { href: '/normas', label: 'Normas', icon: BookOpen },
    ],
  },
  {
    label: 'Conhecimento',
    items: [
      { href: '/ensino', label: 'Ensino', icon: GraduationCap },
      { href: '/assistente-ia', label: 'Assistente IA', icon: Sparkles },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-base-700 bg-base-950">
      <div className="flex items-center gap-2.5 border-b border-base-700 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-copper-600">
          <Zap size={18} className="text-base-950" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-display text-[15px] font-700 leading-none tracking-tight text-ink-100">
            ELETRO<span className="text-copper-500">TECH</span>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-700">
            plataforma de projeto
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="mb-1.5 px-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-700">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'focus-ring flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-[13.5px] transition-colors',
                        active
                          ? 'bg-copper-600/15 text-copper-400'
                          : 'text-ink-300 hover:bg-base-800 hover:text-ink-100'
                      )}
                    >
                      <Icon size={16} strokeWidth={active ? 2.4 : 2} />
                      <span>{item.label}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-copper-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
