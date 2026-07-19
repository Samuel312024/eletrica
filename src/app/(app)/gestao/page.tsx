import { ListChecks } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function GestaoPage() {
  return (
    <div>
      <TitleBlock title="Gestão" subtitle="Cronograma, tarefas e equipe por projeto" />
      <ModulePlaceholder
        icon={ListChecks}
        title="Gestão de projeto"
        description="Quadro de tarefas por projeto (tabela `tasks` já criada), com responsáveis e prazos — próximo passo natural depois do módulo de Projetos."
        nextSteps={[
          'Quadro Kanban de tarefas por projeto',
          'Atribuição de responsáveis (project_members)',
          'Linha do tempo/cronograma do projeto',
          'Orçamento e controle de custos',
        ]}
      />
    </div>
  );
}
