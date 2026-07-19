// Tipos manuais alinhados com supabase/schema.sql
// Para gerar tipos automaticamente a partir do banco real, use:
//   npx supabase gen types typescript --project-id SEU_PROJECT_ID > src/types/database.types.ts

export type ProjectStatus = 'rascunho' | 'em_andamento' | 'em_revisao' | 'concluido' | 'arquivado';
export type UserRole = 'engenheiro' | 'tecnico' | 'projetista' | 'admin' | 'estudante';
export type CalculationType =
  | 'condutor'
  | 'disjuntor'
  | 'queda_tensao'
  | 'curto_circuito'
  | 'iluminacao'
  | 'demanda'
  | 'aterramento'
  | 'fator_potencia'
  | 'outro';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  crea: string | null;
  company: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  client_name: string | null;
  address: string | null;
  description: string | null;
  voltage_supply: string | null;
  status: ProjectStatus;
  cover_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Diagram {
  id: string;
  project_id: string;
  name: string;
  type: 'unifilar' | 'trifilar' | 'planta_baixa' | 'multifilar' | 'blocos';
  data: Record<string, unknown>;
  version: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Calculation {
  id: string;
  project_id: string;
  name: string;
  type: CalculationType;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  standard_ref: string | null;
  created_by: string | null;
  created_at: string;
}

export interface StandardRef {
  id: string;
  code: string;
  title: string;
  category: string | null;
  summary: string | null;
  content: string | null;
  external_url: string | null;
  updated_at: string;
}

export interface AiConversation {
  id: string;
  project_id: string | null;
  user_id: string;
  title: string | null;
  created_at: string;
}

export interface AiMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Nota: as queries usam `.returns<Tipo[]>()` do PostgREST para tipar as
// respostas do Supabase com as interfaces acima. Assim que o projeto Supabase
// estiver criado, rode `npx supabase gen types typescript --project-id SEU_ID`
// para gerar tipos 100% fiéis ao schema real.
