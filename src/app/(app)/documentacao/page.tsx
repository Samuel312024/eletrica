import { FileText } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function DocumentacaoPage() {
  return (
    <div>
      <TitleBlock title="Documentação" subtitle="Memoriais descritivos, ART e laudos técnicos" />
      <ModulePlaceholder
        icon={FileText}
        title="Geração de documentos técnicos"
        description="Documentos gerados a partir dos dados do projeto (diagramas, cálculos, normas aplicadas) usando IA como redator assistido, com revisão humana antes da emissão."
        nextSteps={[
          'Geração de memorial descritivo a partir dos dados do projeto',
          'Modelo de ART pré-preenchido',
          'Upload/armazenamento de arquivos no Supabase Storage',
          'Exportação em PDF com o carimbo/título do projeto',
        ]}
      />
    </div>
  );
}
