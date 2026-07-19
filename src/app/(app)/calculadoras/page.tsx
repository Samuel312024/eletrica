import { Calculator } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function CalculadorasPage() {
  return (
    <div>
      <TitleBlock title="Calculadoras" subtitle="Potência, demanda, iluminação, curto-circuito e mais" />
      <ModulePlaceholder
        icon={Calculator}
        title="Central de calculadoras técnicas"
        description="Cada calculadora é um formulário curto que grava o resultado em `calculations`, ligado ao projeto — para reaproveitar depois em memoriais e diagramas."
        nextSteps={[
          'Cálculo de demanda (NBR 5410 / concessionária local)',
          'Cálculo de iluminância por ambiente (NBR 5413/ISO 8995)',
          'Cálculo de curto-circuito simplificado',
          'Cálculo de fator de potência e correção com banco de capacitores',
        ]}
      />
    </div>
  );
}
