import { GraduationCap } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function EnsinoPage() {
  return (
    <div>
      <TitleBlock title="Ensino" subtitle="Cursos, trilhas e conteúdo técnico" />
      <ModulePlaceholder
        icon={GraduationCap}
        title="Trilhas de aprendizagem"
        description="Conteúdo estruturado por lição (tabela `lessons`) com progresso por usuário (`lesson_progress`) — a IA pode atuar como tutora, respondendo dúvidas dentro de cada lição."
        nextSteps={[
          'Editor/listagem de lições por categoria',
          'Acompanhamento de progresso do usuário',
          'Quizzes com correção automática',
          'Tutor de IA contextual por lição',
        ]}
      />
    </div>
  );
}
