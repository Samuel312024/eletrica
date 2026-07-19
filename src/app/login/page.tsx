'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError('E-mail ou senha incorretos. Verifique e tente novamente.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-base-900 px-4">
      <div className="absolute inset-0 bg-blueprint-grid bg-grid opacity-30" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-copper-600">
            <Zap size={20} className="text-base-950" strokeWidth={2.5} />
          </div>
          <p className="font-display text-lg font-700 tracking-tight text-ink-100">
            ELETRO<span className="text-copper-500">TECH</span>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-700">
            plataforma de projeto elétrico
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-sm border border-base-700 bg-base-950/80 p-6 backdrop-blur-sm"
        >
          <h1 className="mb-5 font-display text-base font-500 text-ink-100">Entrar</h1>

          <label className="mb-3.5 block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
              E-mail
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring w-full rounded-sm border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-700"
              placeholder="voce@empresa.com.br"
            />
          </label>

          <label className="mb-1.5 block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
              Senha
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring w-full rounded-sm border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-700"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="mt-3 rounded-sm border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-[13px] text-danger-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-copper-600 px-4 py-2.5 text-sm font-medium text-base-950 transition-colors hover:bg-copper-500 disabled:opacity-60"
          >
            {loading ? 'Entrando…' : 'Entrar'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-ink-500">
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="text-copper-400 hover:text-copper-300">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
