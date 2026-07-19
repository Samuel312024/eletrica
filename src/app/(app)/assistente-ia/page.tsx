'use client';

import { useRef, useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import clsx from 'clsx';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGESTOES = [
  'Como dimensionar o condutor de um circuito de 32A a 25 metros?',
  'Quais as exigências da NBR 5410 para quadros em áreas molhadas?',
  'Revise os riscos de um projeto com disjuntor de 40A em condutor de 4mm²',
];

export default function AssistenteIaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setError(null);
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Falha ao consultar o assistente.');
        setLoading(false);
        return;
      }

      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setError('Não foi possível conectar ao assistente. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <TitleBlock title="Assistente IA" subtitle="Explicações, dimensionamento assistido e revisão de projeto" />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-lg pt-10 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-sm border border-copper-600/40 bg-copper-600/10">
              <Sparkles size={20} className="text-copper-400" />
            </div>
            <p className="text-sm text-ink-500">
              Pergunte sobre dimensionamento, normas ou peça uma revisão técnica do seu projeto.
            </p>
            <div className="mt-5 space-y-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="focus-ring block w-full rounded-sm border border-base-700 bg-base-950 px-3.5 py-2.5 text-left text-[13px] text-ink-300 transition-colors hover:border-copper-600/40 hover:text-ink-100"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={clsx(
                    'max-w-[80%] whitespace-pre-wrap rounded-sm px-4 py-2.5 text-[13.5px] leading-relaxed',
                    m.role === 'user'
                      ? 'bg-copper-600 text-base-950'
                      : 'border border-base-700 bg-base-950 text-ink-200'
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[13px] text-ink-500">
                <Loader2 size={14} className="animate-spin" /> Consultando…
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {error && (
          <p className="mx-auto mt-4 max-w-2xl rounded-sm border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-[13px] text-danger-400">
            {error}
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-base-700 bg-base-900 px-8 py-4"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao assistente…"
            className="focus-ring flex-1 rounded-sm border border-base-600 bg-base-950 px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="focus-ring flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm bg-copper-600 text-base-950 transition-colors hover:bg-copper-500 disabled:opacity-60"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
