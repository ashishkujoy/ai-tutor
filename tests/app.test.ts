import request from 'supertest';
import createApp from '../src/app';

// Mock the evaluation service to prevent LLM instantiation during app tests
jest.mock('../src/services/evaluation.service', () => ({
  evaluateCode: jest.fn().mockResolvedValue({
    feedback: 'Mock feedback',
    suggestions: 'Mock suggestions',
    rawLLMResponse: 'Mock raw LLM response',
  }),
}));

describe('GET /', () => {
  it('should return a 200 response', async () => {
    const app = createApp({ evaluateCode: jest.fn() });
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return a message', async () => {
    const app = createApp({ evaluateCode: jest.fn() });
    const response = await request(app).get('/');
    expect(response.body).toEqual({ message: 'Hello, world!' });
  });
});