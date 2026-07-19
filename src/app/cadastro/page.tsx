'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CadastroPage() {
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);
    if (error) {
      setError(error.message === 'User already registered'
        ? 'Este e-mail já está cadastrado.'
        : 'Não foi possível criar a conta. Tente novamente.');
      return;
    }
    setDone(true);
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
        </div>

        {done ? (
          <div className="rounded-sm border border-circuit-600/40 bg-circuit-600/10 p-6 text-center">
            <CheckCircle2 size={22} className="mx-auto mb-2 text-circuit-500" />
            <p className="text-sm text-ink-100">Conta criada com sucesso.</p>
            <p className="mt-1 text-[13px] text-ink-500">
              Confirme seu e-mail (se a confirmação estiver ativada no Supabase) e depois entre.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block rounded-sm bg-copper-600 px-4 py-2 text-sm font-medium text-base-950 hover:bg-copper-500"
            >
              Ir para o login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-sm border border-base-700 bg-base-950/80 p-6 backdrop-blur-sm"
          >
            <h1 className="mb-5 font-display text-base font-500 text-ink-100">Criar conta</h1>

            <label className="mb-3.5 block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
                Nome completo
              </span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="focus-ring w-full rounded-sm border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-700"
                placeholder="Seu nome"
              />
            </label>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-ring w-full rounded-sm border border-base-600 bg-base-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-700"
                placeholder="Mínimo 6 caracteres"
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
              {loading ? 'Criando…' : 'Criar conta'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        )}

        <p className="mt-5 text-center text-[13px] text-ink-500">
          Já tem conta?{' '}
          <Link href="/login" className="text-copper-400 hover:text-copper-300">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
