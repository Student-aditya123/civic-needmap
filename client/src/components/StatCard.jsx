export default function StatCard({ label, value, accent }) {
  return (
    <div className="panel p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
