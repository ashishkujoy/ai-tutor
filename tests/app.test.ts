import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
  it('should return a 200 response', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

it('should return a message', async () => {
    const response = await request(app).get('/');
    expect(response.body).toEqual({ message: 'Hello, world!' });
  });
});
