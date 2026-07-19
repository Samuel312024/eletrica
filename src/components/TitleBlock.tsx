interface TitleBlockProps {
  title: string;
  subtitle?: string;
  projectCode?: string;
  revision?: string;
  status?: string;
  action?: React.ReactNode;
}

/**
 * Carimbo inspirado nas pranchas de desenho técnico (NBR 10068): identifica
 * o que está sendo visto, a revisão e o responsável — reaproveitado aqui como
 * cabeçalho padrão de cada tela da plataforma.
 */
export function TitleBlock({ title, subtitle, projectCode, revision, status, action }: TitleBlockProps) {
  return (
    <div className="border-b border-base-700 bg-base-900">
      <div className="flex items-end justify-between px-8 py-5">
        <div>
          <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink-700">
            {projectCode && <span>Nº {projectCode}</span>}
            {projectCode && <span className="text-base-600">/</span>}
            {revision && <span>Rev. {revision}</span>}
          </div>
          <h1 className="font-display text-2xl font-500 tracking-tight text-ink-100">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {status && (
            <span className="rounded-sm border border-base-600 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-300">
              {status}
            </span>
          )}
          {action}
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-copper-600 via-base-700 to-transparent" />
    </div>
  );
}
