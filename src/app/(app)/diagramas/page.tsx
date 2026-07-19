import { CircuitBoard } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function DiagramasPage() {
  return (
    <div>
      <TitleBlock title="Diagramas" subtitle="Unifilares, trifilares e plantas de instalação" />
      <ModulePlaceholder
        icon={CircuitBoard}
        title="Editor de diagramas"
        description="Aqui entra o editor visual de diagramas unifilares/trifilares com biblioteca de símbolos ABNT, salvando em `diagrams.data` (JSON) por projeto."
        nextSteps={[
          'Canvas de edição (SVG ou react-flow) com zoom/pan e grid',
          'Biblioteca de símbolos elétricos ABNT (disjuntor, contator, motor, quadro)',
          'Geração automática de diagrama a partir de descrição em texto (IA)',
          'Exportação em PDF/DWG e versionamento de revisões',
        ]}
      />
    </div>
  );
}
