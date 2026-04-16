import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function MatchingPanel({ requests }) {
  const [selectedId, setSelectedId] = useState(requests[0]?.id || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    api.getMatches(selectedId).then(setData).finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <div className="panel p-5 xl:col-span-1">
        <h3 className="text-lg font-semibold">Volunteer Matching Panel</h3>
        <p className="mt-1 text-sm text-slate-400">Choose a task and instantly view ranked volunteers + explainable score breakdown.</p>
        <select
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {requests.map((r) => (
            <option key={r.id} value={r.id}>{`${r.id} · ${r.area} · ${r.urgency.label}`}</option>
          ))}
        </select>

        {data?.request && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm">
            <p className="font-medium">Selected Need: {data.request.category}</p>
            <p className="mt-1 text-slate-400">{data.request.text}</p>
          </div>
        )}
      </div>

      <div className="panel p-5 xl:col-span-2">
        <h3 className="text-lg font-semibold">Top Matched Volunteers</h3>
        {loading && <p className="mt-4 text-slate-400">AI engine ranking volunteers...</p>}
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {data?.matches?.map((match) => (
            <div key={match.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{match.name}</p>
                <span className="rounded-full bg-brand-500/20 px-2 py-1 text-xs text-brand-500">Score {match.matchScore}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{match.reasoning}</p>
              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <p>Skill Fit: {Math.round(match.explainability.skillScore)}%</p>
                <p>Proximity Fit: {match.explainability.distanceScore}%</p>
                <p>Availability Fit: {Math.round(match.explainability.availabilityScore)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
