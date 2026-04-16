import StatCard from './StatCard';

function PriorityBadge({ level }) {
  const styles = {
    High: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    Medium: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    Low: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
  };

  return <span className={`rounded-full border px-2 py-1 text-xs ${styles[level]}`}>{level}</span>;
}

export default function AdminDashboard({ dashboard, requests }) {
  const categories = Object.entries(dashboard.needsByCategory || {});
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Requests" value={dashboard.stats.totalRequests} accent="text-brand-500" />
        <StatCard label="Urgent Needs" value={dashboard.stats.urgentNeeds} accent="text-rose-400" />
        <StatCard label="Active Volunteers" value={dashboard.stats.activeVolunteers} accent="text-emerald-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Needs by Category</h3>
          <div className="mt-4 space-y-3">
            {categories.map(([category, count]) => (
              <div key={category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{category}</span>
                  <span className="text-slate-400">{count}</span>
                </div>
                <div className="h-2 rounded bg-slate-800">
                  <div className="h-2 rounded bg-brand-500" style={{ width: `${(count / requests.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Response Time Trend (Hours)</h3>
          <div className="mt-4 space-y-3 text-sm">
            {dashboard.responseTimeline.map((item) => (
              <div key={item.day} className="rounded-xl border border-slate-800 p-3">
                <div className="flex items-center justify-between">
                  <span>{item.day}</span>
                  <span className="text-slate-400">Before {item.baseline}h → After {item.aiOptimized}h</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <div className="h-2 rounded bg-rose-400/70" style={{ width: `${item.baseline * 4}%` }} />
                  <div className="h-2 rounded bg-emerald-400/80" style={{ width: `${item.aiOptimized * 4}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="text-lg font-semibold">Live Requests Queue</h3>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-950/70 text-left text-slate-400">
              <tr>
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Keywords</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-t border-slate-800/80">
                  <td className="px-4 py-3">
                    <p className="font-medium">{request.id}</p>
                    <p className="text-xs text-slate-400">{request.area}</p>
                  </td>
                  <td className="px-4 py-3">{request.category}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge level={request.urgency.label} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">{request.keywords.slice(0, 4).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
