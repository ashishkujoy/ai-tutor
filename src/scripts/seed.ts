import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Topic from '../models/topic.model';
import Module from '../models/module.model';
import Lesson from '../models/lesson.model';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    // Clear existing data
    await Promise.all([
      Topic.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({})
    ]);

    console.log('Cleared existing data.');

    // Create Topic
    const topic = new Topic({
      name: 'Program Onboarding',
      description: 'Initial setup and introduction to the STEP program and tools.',
      skillProfileKey: 'programFundamentals'
    });
    await topic.save();

    // Create Module
    const module = new Module({
      name: 'Getting Started',
      description: 'Your first week: setting up your environment and meeting your AI guide.',
      topicId: topic._id,
      targetMonth: 1
    });
    await module.save();

    // Create Lesson Zero
    const lesson = new Lesson({
      name: 'Lesson 0: Meet Your AI Tutor',
      objective: 'To verify your development environment is set up correctly and to learn how to interact with the STEP-Guide for daily challenges.',
      moduleId: module._id,
      dayOfMonth: 1,
      learningContentUrl: '/content/lessons/month1/lesson0.md',
      dailyChallenge: "Your first task is simple. Write a single line of code in any language that prints the string 'Hello, World!' to the console. Submit this line of code to me, your STEP-Guide.",
      solutionCode: "console.log('Hello, World!');"
    });
    await lesson.save();

    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
