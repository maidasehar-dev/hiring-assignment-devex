import request from 'supertest';
import app from '../src/app';

describe('Insights API', () => {
  
  test('GET /health returns a response', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBeDefined();
    expect(response.body.status).toBeDefined();
  });

  test('GET /insights/frequency returns a response', async () => {
    const response = await request(app).get('/insights/frequency');
    expect(response.status).toBeDefined();
  });

  test('GET /insights/failure-rate returns a response', async () => {
    const response = await request(app).get('/insights/failure-rate');
    expect(response.status).toBeDefined();
  });

  test('GET /insights/latest returns a response', async () => {
    const response = await request(app).get('/insights/latest');
    expect(response.status).toBeDefined();
  });

});