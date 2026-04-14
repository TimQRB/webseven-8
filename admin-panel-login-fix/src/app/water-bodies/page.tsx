import { ProtectedShell } from '@/components/ProtectedShell';
import { PageHeader } from '@/components/PageHeader';
import { WaterBodyManager } from '@/components/WaterBodyManager';

export default function WaterBodiesPage() {
  return (
    <ProtectedShell>
      <PageHeader title="Water bodies" />
      <WaterBodyManager />
    </ProtectedShell>
  );
}
