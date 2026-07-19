import { BookOpen, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { TitleBlock } from '@/components/TitleBlock';
import type { StandardRef } from '@/types/database.types';

export default async function NormasPage() {
  const supabase = createClient();
  const { data: standards } = await supabase
    .from('standards')
    .select('*')
    .order('code', { ascending: true })
    .returns<StandardRef[]>();

  return (
    <div>
      <TitleBlock title="Normas" subtitle="Biblioteca técnica de referência (ABNT)" />

      <div className="p-8">
        {standards && standards.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {standards.map((s) => (
              <div key={s.id} className="rounded-sm border border-base-700 bg-base-950 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-[12px] font-medium text-copper-400">{s.code}</span>
                  {s.category && (
                    <span className="rounded-sm border border-base-600 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                      {s.category}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-[14px] font-500 text-ink-100">{s.title}</h3>
                {s.summary && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">{s.summary}</p>}
                {s.external_url && (
                  <a
                    href={s.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[12px] text-copper-400 hover:text-copper-300"
                  >
                    Ver fonte <ExternalLink size={11} />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-base-700 py-16 text-center">
            <BookOpen size={22} className="mx-auto mb-3 text-ink-700" />
            <p className="text-sm text-ink-500">
              Nenhuma norma cadastrada ainda. Rode o <code className="text-ink-300">supabase/schema.sql</code>{' '}
              para popular a biblioteca inicial.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
