import { Cpu } from 'lucide-react';
import { TitleBlock } from '@/components/TitleBlock';
import { ModulePlaceholder } from '@/components/ModulePlaceholder';

export default function AutomacaoPage() {
  return (
    <div>
      <TitleBlock title="Automação" subtitle="Dispositivos supervisionados, CLPs e IoT" />
      <ModulePlaceholder
        icon={Cpu}
        title="Supervisório de automação"
        description="Painel de status de dispositivos (CLPs, relés, medidores) por projeto, com histórico de eventos — a tabela `automation_devices` já está pronta no schema."
        nextSteps={[
          'Cadastro de dispositivos (Modbus/MQTT) por projeto',
          'Dashboard de status em tempo real (Supabase Realtime)',
          'Alertas e histórico de eventos',
          'Integração com IA para diagnóstico de falhas',
        ]}
      />
    </div>
  );
}
