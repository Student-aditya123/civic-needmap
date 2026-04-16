import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { communityReports, volunteers as initialVolunteers } from './data/mockData.js';
import { enrichReport, matchVolunteers } from './ai/analysis.js';

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const clientBuildPath = path.join(__dirname, '../client/dist');
  const hasClientBuild = fs.existsSync(clientBuildPath);

  if (hasClientBuild) {
    app.use(express.static(clientBuildPath));
  }

  let volunteers = [...initialVolunteers];
  const requests = communityReports.map(enrichReport);
  const assignedTasks = [];

  app.get('/api/health', (_, res) => {
    res.json({ ok: true, service: 'ReliefIQ API' });
  });

  app.get('/api/dashboard', (_, res) => {
    const totalRequests = requests.length;
    const urgentNeeds = requests.filter((r) => r.urgency.label === 'High').length;
    const activeVolunteers = volunteers.filter((v) => v.availability !== 'offline').length;

    const needsByCategory = requests.reduce((acc, req) => {
      acc[req.category] = (acc[req.category] || 0) + 1;
      return acc;
    }, {});

    const responseTimeline = [
      { day: 'Mon', baseline: 14, aiOptimized: 8 },
      { day: 'Tue', baseline: 15, aiOptimized: 9 },
      { day: 'Wed', baseline: 13, aiOptimized: 8 },
      { day: 'Thu', baseline: 12, aiOptimized: 7 },
      { day: 'Fri', baseline: 16, aiOptimized: 9 }
    ];

    res.json({
      stats: { totalRequests, urgentNeeds, activeVolunteers },
      needsByCategory,
      responseTimeline,
      impactMetrics: {
        responseTimeReduction: 40,
        volunteerUtilizationGain: 32,
        urgentClosureRate: 78
      }
    });
  });

  app.get('/api/requests', (_, res) => {
    res.json(requests);
  });

  app.get('/api/volunteers', (_, res) => {
    res.json(volunteers);
  });

  app.get('/api/match/:requestId', (req, res) => {
    const request = requests.find((r) => r.id === req.params.requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const matches = matchVolunteers(request, volunteers.filter((v) => v.availability !== 'offline'));
    return res.json({ request, matches });
  });

  app.post('/api/volunteers/:id/toggle', (req, res) => {
    volunteers = volunteers.map((v) =>
      v.id === req.params.id ? { ...v, availability: v.availability === 'offline' ? 'full-day' : 'offline' } : v
    );
    res.json({ ok: true, volunteers });
  });

  app.post('/api/tasks/:requestId/complete', (req, res) => {
    const { volunteerId } = req.body;
    const request = requests.find((r) => r.id === req.params.requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    assignedTasks.push({ requestId: req.params.requestId, volunteerId, completedAt: new Date().toISOString() });
    res.json({ ok: true, task: assignedTasks[assignedTasks.length - 1] });
  });

  if (hasClientBuild) {
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  return app;
}
