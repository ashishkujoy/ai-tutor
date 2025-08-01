import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../src/models/lesson.model';

dotenv.config();

describe('Database', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should write and read from the database', async () => {
    const lesson = new Lesson({
      name: 'Test Lesson',
      objective: 'Test Objective',
      moduleId: new mongoose.Types.ObjectId(),
      dayOfMonth: 1,
      learningContentUrl: 'http://example.com',
      dailyChallenge: 'Test Challenge',
      solutionCode: 'Test Solution',
    });

    await lesson.save();

    const foundLesson = await Lesson.findById(lesson._id);

    expect(foundLesson).not.toBeNull();
    expect(foundLesson?.name).toBe('Test Lesson');
  });
});
