const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const connectDB = require('../../config/db');

let adminToken;

beforeAll(async () => {
  await connectDB();

  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD
    });

  adminToken = response.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Events API', () => {
  test('GET /api/events should return 200 and an array of events', async () => {
    const response = await request(app)
      .get('/api/events');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/events without authentication should return 401', async () => {
    const response = await request(app)
      .post('/api/events')
      .send({
        title: 'Test Event',
        description: 'Testing event creation',
        category: '507f1f77bcf86cd799439011',
        date: '2026-12-01',
        city: 'Cairo',
        venue: 'Test Venue',
        capacity: 50
      });

    expect(response.statusCode).toBe(401);
  });

  test('POST /api/events with invalid data should return 422', async () => {
    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: '',
        category: 'not-a-valid-id',
        date: 'not-a-date',
        capacity: -5
      });

    expect(response.statusCode).toBe(422);
    expect(response.body.status).toBe('fail');
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});