export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 rounded-2xl bg-slate-800" />
      <div className="h-72 rounded-2xl bg-slate-800" />
      <div className="h-72 rounded-2xl bg-slate-800" />
    </div>
  );
}
