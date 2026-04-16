import { useEffect, useState } from 'react';
import { api } from './services/api';
import AdminDashboard from './components/AdminDashboard';
import MatchingPanel from './components/MatchingPanel';
import VolunteerDashboard from './components/VolunteerDashboard';
import ImpactMetrics from './components/ImpactMetrics';
import BeforeAfterPanel from './components/BeforeAfterPanel';
import LoadingSkeleton from './components/LoadingSkeleton';
import MapView from './components/MapView';

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [dashboardData, requestData, volunteerData] = await Promise.all([
      api.getDashboard(),
      api.getRequests(),
      api.getVolunteers()
    ]);
    setDashboard(dashboardData);
    setRequests(requestData);
    setVolunteers(volunteerData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-500">ReliefIQ Platform</p>
          <h1 className="text-2xl font-bold md:text-4xl">AI-Powered Smart Resource Allocation for NGOs</h1>
        </div>
        <button onClick={loadData} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold hover:bg-brand-500">
          Refresh Live Feed
        </button>
      </header>

      {loading || !dashboard ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-6">
          <ImpactMetrics metrics={dashboard.impactMetrics} />
          <BeforeAfterPanel />
          <AdminDashboard dashboard={dashboard} requests={requests} />
          <MatchingPanel requests={requests} />
          <MapView requests={requests} volunteers={volunteers} />
          <VolunteerDashboard volunteers={volunteers} requests={requests} refresh={loadData} />
        </div>
      )}
    </main>
  );
}
