-- ============================================================================
-- ELETROTECH PLATFORM — SCHEMA SUPABASE (PostgreSQL)
-- Execute este arquivo no SQL Editor do painel Supabase (Project > SQL Editor)
-- ou via Supabase CLI: supabase db push
-- ============================================================================

-- ----------------------------------------------------------------------------
-- EXTENSÕES
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. NÚCLEO: PERFIS DE USUÁRIO
-- Estende auth.users (gerenciado pelo Supabase Auth)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'engenheiro' check (role in ('engenheiro', 'tecnico', 'projetista', 'admin', 'estudante')),
  crea text, -- registro profissional (CREA), opcional
  company text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cria o profile automaticamente quando um usuário se cadastra
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. NÚCLEO: PROJETOS
-- ----------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  client_name text,
  address text,
  description text,
  voltage_supply text, -- ex: "220V monofásico", "380V trifásico"
  status text not null default 'rascunho' check (status in ('rascunho', 'em_andamento', 'em_revisao', 'concluido', 'arquivado')),
  cover_color text default '#C87F3D',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'colaborador' check (role in ('proprietario', 'editor', 'colaborador', 'leitor')),
  added_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- Ao criar um projeto, o dono vira membro automaticamente
create function public.handle_new_project()
returns trigger as $$
begin
  insert into public.project_members (project_id, user_id, role)
  values (new.id, new.owner_id, 'proprietario');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_created
  after insert on public.projects
  for each row execute procedure public.handle_new_project();

-- ----------------------------------------------------------------------------
-- 3. MÓDULO DIAGRAMAS (unifilares, trifilares, plantas de instalação)
-- ----------------------------------------------------------------------------
create table public.diagrams (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null default 'unifilar' check (type in ('unifilar', 'trifilar', 'planta_baixa', 'multifilar', 'blocos')),
  data jsonb not null default '{}'::jsonb, -- estrutura do diagrama (nós, conexões, símbolos)
  version int not null default 1,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. MÓDULO DIMENSIONAMENTO E CALCULADORAS
-- ----------------------------------------------------------------------------
create table public.calculations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null check (type in (
    'condutor', 'disjuntor', 'queda_tensao', 'curto_circuito',
    'iluminacao', 'demanda', 'aterramento', 'fator_potencia', 'outro'
  )),
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  standard_ref text, -- ex: "NBR 5410 §6.2.5"
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5. MÓDULO NORMAS (biblioteca técnica consultável)
-- ----------------------------------------------------------------------------
create table public.standards (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique, -- ex: "NBR 5410"
  title text not null,
  category text, -- ex: "instalações de baixa tensão"
  summary text,
  content text,
  external_url text,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. MÓDULO DOCUMENTAÇÃO (memoriais, ARTs, laudos)
-- ----------------------------------------------------------------------------
create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null default 'memorial_descritivo' check (type in (
    'memorial_descritivo', 'art', 'laudo_tecnico', 'orcamento', 'relatorio_manutencao', 'outro'
  )),
  file_url text, -- caminho no Supabase Storage
  generated_by_ai boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. MÓDULO AUTOMAÇÃO (dispositivos supervisionados / IoT)
-- ----------------------------------------------------------------------------
create table public.automation_devices (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  device_type text, -- ex: "CLP", "relé inteligente", "medidor"
  protocol text, -- ex: "Modbus", "MQTT"
  address text, -- IP ou endereço de barramento
  status text not null default 'offline' check (status in ('online', 'offline', 'alarme', 'manutencao')),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. MÓDULO GESTÃO (cronograma e tarefas)
-- ----------------------------------------------------------------------------
create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pendente' check (status in ('pendente', 'em_andamento', 'concluida', 'atrasada')),
  assigned_to uuid references public.profiles(id),
  due_date date,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 9. MÓDULO ENSINO (cursos e progresso)
-- ----------------------------------------------------------------------------
create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  content text,
  category text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

-- ----------------------------------------------------------------------------
-- 10. IA: CONVERSAS E MENSAGENS (assistente, revisão de projeto)
-- ----------------------------------------------------------------------------
create table public.ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text default 'Nova conversa',
  created_at timestamptz not null default now()
);

create table public.ai_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Regra geral: usuário só acessa dados de projetos onde é membro.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.diagrams enable row level security;
alter table public.calculations enable row level security;
alter table public.standards enable row level security;
alter table public.documents enable row level security;
alter table public.automation_devices enable row level security;
alter table public.tasks enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

-- Função auxiliar: usuário é membro do projeto?
create function public.is_project_member(pid uuid)
returns boolean as $$
  select exists (
    select 1 from public.project_members
    where project_id = pid and user_id = auth.uid()
  );
$$ language sql security definer stable;

-- PROFILES: cada usuário vê e edita o próprio perfil; perfis são visíveis para colegas de projeto
create policy "profiles: leitura própria ou de colegas de projeto"
  on public.profiles for select
  using (
    id = auth.uid()
    or exists (
      select 1 from public.project_members pm1
      join public.project_members pm2 on pm1.project_id = pm2.project_id
      where pm1.user_id = auth.uid() and pm2.user_id = profiles.id
    )
  );

create policy "profiles: atualização própria"
  on public.profiles for update
  using (id = auth.uid());

-- PROJECTS
create policy "projects: leitura por membros"
  on public.projects for select
  using (public.is_project_member(id));

create policy "projects: criação pelo próprio usuário autenticado"
  on public.projects for insert
  with check (owner_id = auth.uid());

create policy "projects: atualização por membros editores"
  on public.projects for update
  using (public.is_project_member(id));

create policy "projects: exclusão pelo dono"
  on public.projects for delete
  using (owner_id = auth.uid());

-- PROJECT_MEMBERS
create policy "project_members: leitura por membros do mesmo projeto"
  on public.project_members for select
  using (public.is_project_member(project_id));

create policy "project_members: gerenciado pelo dono do projeto"
  on public.project_members for all
  using (exists (select 1 from public.projects where id = project_id and owner_id = auth.uid()));

-- Tabelas filhas de projeto: mesma regra (membro do projeto)
create policy "diagrams: acesso por membros" on public.diagrams for all
  using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

create policy "calculations: acesso por membros" on public.calculations for all
  using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

create policy "documents: acesso por membros" on public.documents for all
  using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

create policy "automation_devices: acesso por membros" on public.automation_devices for all
  using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

create policy "tasks: acesso por membros" on public.tasks for all
  using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

create policy "ai_conversations: acesso do próprio usuário" on public.ai_conversations for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "ai_messages: acesso via conversa própria" on public.ai_messages for all
  using (exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()));

-- STANDARDS e LESSONS: conteúdo público de leitura para qualquer usuário autenticado
create policy "standards: leitura pública autenticada"
  on public.standards for select
  using (auth.role() = 'authenticated');

create policy "lessons: leitura pública autenticada"
  on public.lessons for select
  using (auth.role() = 'authenticated');

create policy "lesson_progress: acesso próprio"
  on public.lesson_progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================================
-- SEED INICIAL (opcional) — algumas normas de referência
-- ============================================================================
insert into public.standards (code, title, category, summary) values
  ('NBR 5410', 'Instalações elétricas de baixa tensão', 'Baixa tensão', 'Norma principal para projeto e execução de instalações elétricas de baixa tensão no Brasil.'),
  ('NBR 5419', 'Proteção contra descargas atmosféricas (SPDA)', 'Proteção', 'Requisitos para projeto, instalação, inspeção e manutenção de sistemas de proteção contra descargas atmosféricas.'),
  ('NBR 14039', 'Instalações elétricas de média tensão', 'Média tensão', 'Norma para instalações de 1kV a 36,2kV.'),
  ('NBR 5413', 'Iluminância de interiores', 'Iluminação', 'Define níveis mínimos de iluminância para diferentes ambientes.')
on conflict (code) do nothing;
