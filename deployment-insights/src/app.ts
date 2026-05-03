import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const REGISTRY_URL = process.env.REGISTRY_URL || 'http://localhost:5176/api/deployments';

app.get('/health', async (req: Request, res: Response) => {
  try {
    await axios.get(REGISTRY_URL);
    res.json({ 
      status: 'ok', 
      message: 'Insights service is running',
      registry: 'reachable'
    });
  } catch {
    res.status(503).json({ 
      status: 'error', 
      registry: 'unreachable' 
    });
  }
});

app.get('/insights/latest', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(REGISTRY_URL);
    const deployments = response.data;
    const latest: Record<string, any> = {};
    
    for (const deployment of deployments) {
      const key = `${deployment.serviceName}-${deployment.environment}`;
      if (!latest[key] || new Date(deployment.startedAt) > new Date(latest[key].startedAt)) {
        latest[key] = deployment;
      }
    }
    res.json(Object.values(latest));
  } catch {
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

app.get('/insights/failure-rate', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(REGISTRY_URL);
    const deployments = response.data;
    const stats: Record<string, { total: number; failed: number }> = {};

    for (const deployment of deployments) {
      const key = `${deployment.serviceName}-${deployment.environment}`;
      if (!stats[key]) {
        stats[key] = { total: 0, failed: 0 };
      }
      stats[key].total++;
      if (deployment.status === 'Failed' || deployment.status === 'RolledBack') {
        stats[key].failed++;
      }
    }

    const result = Object.entries(stats).map(([key, value]) => ({
      service: key,
      total: value.total,
      failed: value.failed,
      failureRate: ((value.failed / value.total) * 100).toFixed(2) + '%'
    }));
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

app.get('/insights/frequency', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(REGISTRY_URL);
    const deployments = response.data;
    const frequency: Record<string, number> = {};

    for (const deployment of deployments) {
      const service = deployment.serviceName;
      if (!frequency[service]) {
        frequency[service] = 0;
      }
      frequency[service]++;
    }

    const result = Object.entries(frequency).map(([service, count]) => ({
      service,
      totalDeployments: count
    }));
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

// Average lead time from deploy start to success per service
app.get('/insights/lead-time', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(REGISTRY_URL);
    const deployments = response.data;

    const serviceStats: Record<string, { totalTime: number; count: number }> = {};

    for (const deployment of deployments) {
      if (deployment.status === 'Succeeded' && deployment.startedAt && deployment.finishedAt) {
        const service = deployment.serviceName;
        const startTime = new Date(deployment.startedAt).getTime();
        const endTime = new Date(deployment.finishedAt).getTime();
        const duration = (endTime - startTime) / 1000 / 60;

        if (!serviceStats[service]) {
          serviceStats[service] = { totalTime: 0, count: 0 };
        }
        serviceStats[service].totalTime += duration;
        serviceStats[service].count++;
      }
    }

    const result = Object.entries(serviceStats).map(([service, stats]) => ({
      service,
      averageLeadTimeMinutes: (stats.totalTime / stats.count).toFixed(2),
      totalDeployments: stats.count
    }));

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});
export default app;