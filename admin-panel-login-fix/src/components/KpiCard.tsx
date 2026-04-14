export function KpiCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="card">
      <div className="muted">{title}</div>
      <div className="kpi">{value}</div>
      {hint ? <div className="muted">{hint}</div> : null}
    </div>
  );
}
