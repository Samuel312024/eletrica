import type { LucideIcon } from 'lucide-react';

interface ModulePlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  nextSteps: string[];
}

/**
 * Tela padrão para módulos ainda não implementados. Em vez de uma tela em
 * branco, deixa claro o que o módulo vai fazer e o que falta construir —
 * pensada para ser substituída, módulo a módulo, por implementações reais.
 */
export function ModulePlaceholder({ icon: Icon, title, description, nextSteps }: ModulePlaceholderProps) {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-40" />
      <div className="relative max-w-lg rounded-sm border border-base-700 bg-base-900/90 p-8 backdrop-blur-sm">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm border border-copper-600/40 bg-copper-600/10">
          <Icon size={20} className="text-copper-400" />
        </div>
        <h2 className="font-display text-lg font-500 text-ink-100">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p>
        <div className="mt-5 border-t border-base-700 pt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-700">
            Próximas etapas de construção
          </p>
          <ul className="space-y-1.5">
            {nextSteps.map((step) => (
              <li key={step} className="flex items-start gap-2 text-[13px] text-ink-300">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal-500" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
