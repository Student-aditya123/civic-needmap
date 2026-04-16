const points = [
  { area: 'Avg assignment time', before: '26 mins', after: '11 mins' },
  { area: 'Duplicate dispatches', before: '14/day', after: '3/day' },
  { area: 'Volunteer fit score', before: '61%', after: '89%' }
];

export default function BeforeAfterPanel() {
  return (
    <div className="panel p-5">
      <h3 className="text-lg font-semibold">Before vs After AI Optimization</h3>
      <div className="mt-4 space-y-3">
        {points.map((point) => (
          <div key={point.area} className="grid grid-cols-3 items-center rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-sm">
            <span className="text-slate-300">{point.area}</span>
            <span className="text-rose-300">Before: {point.before}</span>
            <span className="text-emerald-300">After: {point.after}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
