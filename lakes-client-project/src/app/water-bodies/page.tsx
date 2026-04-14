import { ProtectedShell } from '@/components/ProtectedShell';
import { PageHeader } from '@/components/PageHeader';
import { WaterBodiesExplorer } from '@/components/WaterBodiesExplorer';

export default function WaterBodiesPage() {
  return (
    <ProtectedShell>
      <div className="stack">
        <PageHeader
          title="Озёра"
          description="Карта MapLibre со всеми водоёмами из базы данных, выбор через карту или dropdown."
        />
        <WaterBodiesExplorer />
      </div>
    </ProtectedShell>
  );
}
