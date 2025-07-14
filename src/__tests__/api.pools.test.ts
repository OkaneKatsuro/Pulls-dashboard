import request from 'supertest';

const API_BASE_URL = 'http://localhost:3000';

describe('API /api/pools', () => {
  it('should return pools list', async () => {
    const res = await request(API_BASE_URL).get('/api/pools');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pools');
    expect(Array.isArray(res.body.pools)).toBe(true);
    expect(res.body.pools.length).toBeGreaterThan(0);
  });

  it('should return pool details', async () => {
    const res = await request(API_BASE_URL).get('/api/pools/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pool');
    expect(res.body.pool).toHaveProperty('id', '1');
    expect(res.body.pool).toHaveProperty('name');
    expect(res.body.pool).toHaveProperty('algorithm');
  });

  it('should handle non-existent pool', async () => {
    const res = await request(API_BASE_URL).get('/api/pools/999');
    expect(res.status).toBe(404);
  });

  it('should filter pools by status', async () => {
    const res = await request(API_BASE_URL).get('/api/pools?status=active');
    expect(res.status).toBe(200);
    expect(res.body.pools.every((pool: { status: string }) => pool.status === 'active')).toBe(true);
  });
}); 