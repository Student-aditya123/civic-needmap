export default function MapView({ requests, volunteers }) {
  return (
    <div className="panel p-5">
      <h3 className="text-lg font-semibold">Geo Awareness Map (Prototype)</h3>
      <p className="mt-1 text-sm text-slate-400">Blue points = community needs · Green points = volunteers</p>
      <div className="relative mt-4 h-72 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {requests.slice(0, 12).map((point, index) => (
          <div
            key={point.id}
            className="absolute h-3 w-3 rounded-full bg-brand-500 shadow-glow"
            style={{ left: `${8 + (index % 6) * 15}%`, top: `${10 + Math.floor(index / 6) * 38}%` }}
            title={`${point.id} - ${point.area}`}
          />
        ))}
        {volunteers.slice(0, 12).map((volunteer, index) => (
          <div
            key={volunteer.id}
            className="absolute h-3 w-3 rounded-full bg-emerald-400"
            style={{ left: `${12 + (index % 6) * 14}%`, top: `${18 + Math.floor(index / 6) * 35}%` }}
            title={volunteer.name}
          />
        ))}
      </div>
    </div>
  );
}
