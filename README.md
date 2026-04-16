# ReliefIQ — AI-Powered Smart Resource Allocation System

A demo-ready startup-style prototype for NGOs and community support teams to aggregate scattered needs, prioritize urgent cases, and match the best volunteers using explainable AI.

## Why this prototype stands out
- **NLP-based intake parsing** from unstructured reports.
- **Urgency scoring** (`High/Medium/Low`) driven by severity cues and demand magnitude.
- **Explainable volunteer matching** using weighted skill fit + distance + availability.
- **Modern SaaS dashboard** with impact metrics, before-vs-after analytics, live queue, matching panel, volunteer controls, and map-style overview.

## Architecture

```text
smart-resource-allocations/
├── client/                     # React + Vite + Tailwind frontend
│   ├── src/components/         # Modular dashboard components
│   └── src/services/api.js     # API integration layer
├── server/                     # Express backend API
│   ├── ai/analysis.js          # AI heuristics in JS (used live)
│   ├── ai/model.py             # Optional Python AI layer scaffold
│   └── data/mockData.js        # 20 requests + 15 volunteers
└── README.md
```

## Feature walkthrough

### 1) Community Needs Aggregation
`server/data/mockData.js` simulates incoming survey reports and field updates with area, geolocation, and free-form text.

### 2) AI Need Analysis
In `server/ai/analysis.js`:
- `extractKeywords(text)` detects domain keywords like food, medical, shelter, transport.
- `categorizeNeeds(keywords)` maps extracted terms to operational categories.
- `scoreUrgency(text, severitySignals)` computes urgency labels and numerical severity.

### 3) Smart Volunteer Matching
`matchVolunteers(request, volunteers)` ranks top candidates by:
- **Skill score (50%)**
- **Distance score (30%)** using haversine distance
- **Availability score (20%)**

Each recommendation includes human-readable reasoning + component scores for explainability.

### 4) Dashboard UX
The React app includes:
- **Admin Dashboard** (cards + category graph + response trend + request table)
- **Volunteer Matching Panel** (task selector, ranked volunteers, AI reasons)
- **Map View Prototype** (needs + volunteers distribution)
- **Volunteer Dashboard** (availability toggles, assignments, completion actions)
- **Impact + Before/After panels** for demo storytelling
- Loading states and subtle animations for polish

## API Endpoints
- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/requests`
- `GET /api/volunteers`
- `GET /api/match/:requestId`
- `POST /api/volunteers/:id/toggle`
- `POST /api/tasks/:requestId/complete`

## Run locally

### Prerequisites
- Node.js 18+
- npm

### Install and run
```bash
npm install
npm --prefix server install
npm --prefix client install
npm run dev
```

### App URLs
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`

## Hackathon demo script (quick)
1. Open dashboard and show urgent request count.
2. Pick an urgent request in Matching Panel and explain AI score factors.
3. Toggle a volunteer offline/online to show dynamic operations.
4. Highlight impact metrics (`40% faster response`) and before/after outcomes.

## Future roadmap
- Replace heuristics with transformer-based classifier and embedding similarity matching.
- Real geospatial mapping with Mapbox/Leaflet.
- MongoDB persistence and role-based auth.
- Event streaming for real-time updates.
