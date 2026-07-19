'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TitleBlock } from '@/components/TitleBlock';
import { createClient } from '@/lib/supabase/client';

export default function NovoProjetoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    name: '',
    client_name: '',
    address: '',
    voltage_supply: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Sessão expirada. Entre novamente.');
      setLoading(false);
      return;
    }

    const { data: inserted, error } = await supabase
      .from('projects')
      .insert({ ...form, owner_id: user.id })
      .select('id')
      .single();
    const data = inserted as { id: string } | null;

    setLoading(false);
    if (error || !data) {
      setError('Não foi possível criar o projeto. Tente novamente.');
      return;
    }

    router.push(`/projetos/${data.id}`);
  }

  return (
    <div>
      <TitleBlock title="Novo projeto" subtitle="Dados iniciais — você pode completar o resto depois" />

      <form onSubmit={handleSubmit} className="max-w-xl p-8">
        <label className="mb-4 block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
            Nome do projeto *
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Ex.: Instalação elétrica — Galpão Industrial Zona Norte"
            className="focus-ring w-full rounded-sm border border-base-600 bg-base-950 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-700"
          />
        </label>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
              Cliente
            </span>
            <input
              value={form.client_name}
              onChange={(e) => update('client_name', e.target.value)}
              placeholder="Nome do cliente"
              className="focus-ring w-full rounded-sm border border-base-600 bg-base-950 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-700"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
              Tensão de entrada
            </span>
            <input
              value={form.voltage_supply}
              onChange={(e) => update('voltage_supply', e.target.value)}
              placeholder="Ex.: 380V trifásico"
              className="focus-ring w-full rounded-sm border border-base-600 bg-base-950 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-700"
            />
          </label>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
            Endereço
          </span>
          <input
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="Endereço da obra/instalação"
            className="focus-ring w-full rounded-sm border border-base-600 bg-base-950 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-700"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-ink-500">
            Descrição
          </span>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            placeholder="Escopo geral do projeto"
            className="focus-ring w-full rounded-sm border border-base-600 bg-base-950 px-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-700"
          />
        </label>

        {error && (
          <p className="mb-4 rounded-sm border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-[13px] text-danger-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring rounded-sm bg-copper-600 px-5 py-2.5 text-sm font-medium text-base-950 transition-colors hover:bg-copper-500 disabled:opacity-60"
        >
          {loading ? 'Criando…' : 'Criar projeto'}
        </button>
      </form>
    </div>
  );
}
