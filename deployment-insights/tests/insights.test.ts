import request from 'supertest';
import app from '../src/app';

describe('Insights API', () => {
  
  test('GET /health returns status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBeDefined();
  });

  test('GET /insights/frequency returns array', async () => {
    const response = await request(app).get('/insights/frequency');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /insights/failure-rate returns array', async () => {
    const response = await request(app).get('/insights/failure-rate');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /insights/latest returns array', async () => {
    const response = await request(app).get('/insights/latest');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});