const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export const api = {
  getDashboard: () => getJson('/dashboard'),
  getRequests: () => getJson('/requests'),
  getVolunteers: () => getJson('/volunteers'),
  getMatches: (requestId) => getJson(`/match/${requestId}`),
  toggleVolunteer: (id) =>
    fetch(`${API_BASE}/volunteers/${id}/toggle`, { method: 'POST' }).then((res) => res.json()),
  completeTask: (requestId, volunteerId) =>
    fetch(`${API_BASE}/tasks/${requestId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerId })
    }).then((res) => res.json())
};
