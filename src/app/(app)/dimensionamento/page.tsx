import { Ruler } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function DimensionamentoPage() {
  return (
    <div>
      <TitleBlock title="Dimensionamento" subtitle="Condutores, disjuntores, quedas de tensão e aterramento" />
      <ModulePlaceholder
        icon={Ruler}
        title="Motor de dimensionamento assistido"
        description="Cálculos conforme a NBR 5410, salvos em `calculations` com o input, o resultado e a referência normativa usada — para dar rastreabilidade técnica ao projeto."
        nextSteps={[
          'Dimensionamento de condutores por capacidade de condução e queda de tensão',
          'Seleção de disjuntores (coordenação com condutores e curto-circuito)',
          'Cálculo de queda de tensão e correção de fator de agrupamento/temperatura',
          'IA explicando cada passo do cálculo com base na norma citada',
        ]}
      />
    </div>
  );
}
