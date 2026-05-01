import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const REGISTRY_URL = 'http://localhost:5176/api/deployments';

// Health check endpoint
app.get('/health', async (req, res) => {
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

// Latest deployed version per service per environment
app.get('/insights/latest', async (req, res) => {
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

// Failure rate per service and environment
app.get('/insights/failure-rate', async (req, res) => {
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

// Deployment frequency per service
app.get('/insights/frequency', async (req, res) => {
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

export default app;