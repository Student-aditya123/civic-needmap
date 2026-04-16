# Smart Resource Allocations

## 🚀 Hackathon Winning System Design

Smart Resource Allocations is a full-stack prototype built to deliver AI-driven allocation and volunteer matching for humanitarian response. It combines a lightweight React frontend, a structured Express API backend, and an experimental Python allocation engine to showcase fast iteration, technical depth, and real-world impact.

### Why this wins hackathon

- **Moonshot-aware allocation**: a reserved capacity bucket ensures high-potential, underfunded requests still get a chance to move forward.
- **AI-first matching**: volunteer recommendations are based on skills, location, availability, and request urgency.
- **Modular MVP**: each layer is decoupled and easy to extend - ideal for rapid prototyping and judged on design quality.
- **Clear metrics and dashboard**: live analytics make the solution compelling for judges and stakeholders.
- **Production-ready architecture**: uses standard tooling (`React`, `Vite`, `Express`) with a clear path to deployment.

## 🧠 System Architecture

The system is designed as a clean, extensible three-layer architecture:

1. **Frontend** (`client/`)
   - React + Vite single-page UI
   - Fetches live dashboard stats, request feeds, and volunteer profiles
   - Renders match panels, maps, volunteer controls, and impact metrics

2. **Backend API** (`server/`)
   - Express server serving JSON endpoints
   - Enriches request data with extracted keywords, categories, and urgency scores
   - Performs volunteer ranking with explainable scoring
   - Supports availability toggles and task completion actions

3. **Allocation Layer**
   - `smart_allocation.py` contains the `SmartAllocator` engine
   - Implements a unique **moonshot slot** strategy
   - Enforces fairness and request limits while preserving exploration

## ⚙️ Core Components

### Frontend
- `client/src/App.jsx` - app bootstrap and live data loading
- `client/src/components` - reusable UI components for dashboards, maps, and matching
- Tailwind-style classes for a polished hackathon UI

### Backend
- `server/index.js` - primary API server
- `server/ai/analysis.js` - request enrichment and volunteer scoring
- `server/data/mockData.js` - realistic sample requests and volunteer profiles

### Allocation Logic
- `smart_allocation.py` - implements the core allocation algorithm
- `test_smart_allocation.py` - verifies moonshot prioritization and capacity safety

## 🔧 Technology Stack

- Node.js / Express
- React / Vite
- Vanilla JavaScript for AI heuristics
- Python for experimental allocation logic and unit testing

## 📈 System Flow

1. The client requests live data from `/api/dashboard`, `/api/requests`, and `/api/volunteers`.
2. The backend enriches every request with:
   - extracted keywords
   - need category
   - urgency score
3. The matching API ranks volunteers using:
   - skills overlap
   - geographic proximity
   - availability weighting
4. The Python allocator can be used to simulate or extend resource allocation policies with a reserved moonshot slot.

## 🏆 God-Level Hackathon Pitch

This project is built to impress judges because it delivers both:

- **Practical rescue coordination**: real-world supported scenarios like floods, medicine shortages, shelter overcrowding, and logistics.
- **Strategic AI innovation**: not just automation, but an allocation policy that protects discovery and high-risk/high-reward requests.

The moonshot feature is the standout differentiator: it makes the product feel deliberate, thoughtful, and future-ready.

## ▶️ Run the project

From the repository root:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## 🚀 Deploy on Vercel

This repo is Vercel-ready via `vercel.json` and a serverless backend wrapper.

1. Install dependencies:

```bash
npm install
cd server
npm install
```

2. Log in to Vercel:

```bash
npx vercel login
```

3. Deploy:

```bash
cd c:\Users\Adity\OneDrive\Smart-Resource-Allocations
npx vercel
```

4. For production:

```bash
npx vercel --prod
```

Your backend will be available under `/api/*` and the frontend will be served as a static Vite app.

## 🌐 Live Demo

- https://civic-needmap.onrender.com/

## ✅ Run tests

```bash
python -m unittest -v
```

---

Built to win with fast delivery, transparent AI logic, and a memorable product story.