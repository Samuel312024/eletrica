# EletroTech — Plataforma de Engenharia Elétrica

Plataforma completa de engenharia elétrica com IA: do ponto de entrega de energia até a manutenção,
cobrindo projetos, diagramas, dimensionamento, normas, calculadoras, documentação, automação, gestão
e ensino — com um assistente de IA transversal.

Este repositório é a **fundação profissional** da plataforma: arquitetura, autenticação, banco de
dados, design system e os primeiros módulos funcionando de ponta a ponta (Projetos, Normas,
Assistente IA). Os demais módulos já têm rota, schema de banco e tela prontos para receber a
implementação completa — veja o roadmap no final deste documento.

---

## 1. Stack

- **Frontend/Web**: Next.js 14 (App Router) + TypeScript + Tailwind CSS → deploy na **Vercel**
- **Backend/Banco**: **Supabase** (Postgres + Auth + Row Level Security + Storage)
- **IA**: Anthropic API (Claude), chamada apenas no servidor (rota `/api/ai`)
- **Mobile**: React Native/Expo (roadmap — reaproveita os tipos e a lógica do web)
- **Versionamento**: Git + GitHub

## 2. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor** e rode o conteúdo de `supabase/schema.sql` (cria todas as tabelas, RLS e
   popula a biblioteca inicial de normas).
3. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (uso futuro em rotas administrativas — nunca
     exponha no frontend)
4. Em **Authentication → Providers**, confirme que **Email** está habilitado. Se quiser desativar a
   confirmação por e-mail durante o desenvolvimento, ajuste em **Authentication → Settings**.

## 3. Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha com suas chaves do Supabase e da Anthropic
npm run dev
```

Acesse `http://localhost:3000`. A primeira tela redireciona para `/login` ou `/dashboard`
dependendo da sessão.

### Variáveis de ambiente (`.env.local`)

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |

## 4. Versionamento com Git/GitHub

```bash
git init
git add .
git commit -m "Fundação da plataforma EletroTech"
gh repo create eletrotech-platform --private --source=. --push
# ou, sem a CLI do GitHub:
# git remote add origin https://github.com/SEU_USUARIO/eletrotech-platform.git
# git push -u origin main
```

Sugestão de fluxo: uma branch por módulo (`feature/diagramas`, `feature/dimensionamento`...),
merge para `main` via Pull Request. Cada push em `main` aciona o deploy automático na Vercel (passo
5).

## 5. Deploy na Vercel

1. Importe o repositório do GitHub em [vercel.com/new](https://vercel.com/new).
2. Em **Environment Variables**, cadastre as mesmas 4 variáveis do `.env.local`.
3. Deploy. A cada push na branch principal, a Vercel gera um novo deploy automaticamente.

## 6. Publicação mobile (roadmap)

O app mobile é planejado em React Native com Expo, reaproveitando:
- Os tipos de `src/types/database.types.ts`
- A mesma instância do Supabase (o SDK JS funciona em React Native)
- A mesma rota de IA (`/api/ai`, chamada como uma API externa a partir do app)

Passos quando for a hora de iniciar:
```bash
npx create-expo-app eletrotech-mobile
# instalar @supabase/supabase-js e configurar AsyncStorage como storage de sessão
```
Publicação: EAS Build (Expo) para gerar os binários e submeter à **Google Play Console** e à
**Apple App Store Connect**.

## 7. Estrutura do projeto

```
src/
  app/
    login/, cadastro/           → autenticação
    (app)/                      → rotas protegidas (grupo com layout de sidebar)
      dashboard/                → painel geral (funcional)
      projetos/                 → módulo núcleo (funcional: listar, criar, ver)
      diagramas/                → módulo (estrutura pronta, editor a construir)
      dimensionamento/          → módulo (estrutura pronta, motor de cálculo a construir)
      calculadoras/             → módulo (estrutura pronta)
      documentacao/             → módulo (estrutura pronta)
      automacao/                → módulo (estrutura pronta)
      gestao/                   → módulo (estrutura pronta)
      ensino/                   → módulo (estrutura pronta)
      normas/                   → módulo funcional (lê da tabela `standards`)
      assistente-ia/            → chat funcional com a Anthropic API
    api/ai/route.ts             → rota de servidor que fala com a Anthropic API
  components/                   → Sidebar, TitleBlock (carimbo de prancha), ModulePlaceholder
  lib/supabase/                 → clientes Supabase (browser, server, middleware)
  types/database.types.ts       → tipos manuais alinhados ao schema.sql
supabase/schema.sql             → schema completo + RLS + seed de normas
```

## 8. Roadmap de evolução módulo a módulo

A ideia é adicionar um módulo real por vez, sem quebrar os demais:

1. **Diagramas** — editor visual (canvas SVG ou `react-flow`) com biblioteca de símbolos ABNT,
   salvando em `diagrams.data` (JSON) por projeto; geração assistida por IA a partir de descrição
   em texto.
2. **Dimensionamento** — formulários de cálculo (condutor, disjuntor, queda de tensão, aterramento)
   conforme NBR 5410, gravando em `calculations` com a referência normativa usada.
3. **Calculadoras** — demanda, iluminação (NBR 5413), curto-circuito, fator de potência.
4. **Documentação** — geração de memorial descritivo e ART a partir dos dados do projeto, com
   revisão humana antes da emissão; armazenamento de arquivos no Supabase Storage.
5. **Gestão** — quadro de tarefas (`tasks`, já no schema) por projeto, com responsáveis e prazos.
6. **Automação** — supervisório de dispositivos (`automation_devices`), status em tempo real via
   Supabase Realtime.
7. **Ensino** — trilhas de aprendizagem (`lessons`, `lesson_progress`) com tutor de IA contextual.
8. **IA transversal** — expandir `/api/ai` para revisão automática de projeto (ler diagramas e
   cálculos do projeto e apontar riscos) e para gerar diagramas estruturados, não só texto.
9. **Mobile** — iniciar o app Expo reaproveitando tipos e a mesma base do Supabase.

Cada módulo pode ser pedido individualmente para continuar a implementação — a base (auth, schema,
design system, navegação) já está pronta para sustentar todos eles.
