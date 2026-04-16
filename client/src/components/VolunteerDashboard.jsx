import { api } from '../services/api';

export default function VolunteerDashboard({ volunteers, refresh, requests }) {
  const assigned = requests.slice(0, 5).map((request, index) => ({
    ...request,
    volunteer: volunteers[index % volunteers.length]?.name || 'Unassigned'
  }));

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="panel p-5">
        <h3 className="text-lg font-semibold">Volunteer Dashboard</h3>
        <div className="mt-4 space-y-3">
          {volunteers.map((volunteer) => (
            <div key={volunteer.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-sm">
              <div>
                <p className="font-medium">{volunteer.name}</p>
                <p className="text-xs text-slate-400">{volunteer.skills.join(', ')}</p>
              </div>
              <button
                onClick={async () => {
                  await api.toggleVolunteer(volunteer.id);
                  refresh();
                }}
                className={`rounded-lg px-3 py-1 text-xs font-medium ${
                  volunteer.availability === 'offline' ? 'bg-slate-700 text-slate-100' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {volunteer.availability === 'offline' ? 'Set Online' : `Available: ${volunteer.availability}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="text-lg font-semibold">Assigned Tasks</h3>
        <div className="mt-4 space-y-3">
          {assigned.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-sm">
              <p className="font-medium">{task.id} · {task.area}</p>
              <p className="text-xs text-slate-400">Owner: {task.volunteer}</p>
              <button
                className="mt-2 rounded-lg bg-brand-600 px-3 py-1 text-xs font-semibold"
                onClick={() => api.completeTask(task.id, volunteers[0]?.id)}
              >
                Mark Complete
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
