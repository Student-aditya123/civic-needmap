const metrics = [
  { label: 'Response Time Reduced', value: '40%' },
  { label: 'Volunteer Utilization Gain', value: '32%' },
  { label: 'Urgent Cases Closed in 24h', value: '78%' }
];

export default function ImpactMetrics() {
  return (
    <div className="panel p-5">
      <h3 className="text-lg font-semibold">Impact Metrics</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
