
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Intern from '../models/intern.model';
import Instructor from '../models/instructor.model';
import Cohort from '../models/cohort.model';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);

    // Clear existing data
    await Promise.all([
      Intern.deleteMany({}),
      Instructor.deleteMany({}),
      Cohort.deleteMany({})
    ]);

    console.log('Cleared existing user, instructor, and cohort data.');

    // Create Instructor
    const instructor = new Instructor({
      fullName: 'Ashish Kumar',
      email: 'ashish.kumar@example.com',
      passwordHash: 'hashed_password' // Replace with a real hash
    });
    await instructor.save();

    // Create Cohort
    const cohort = new Cohort({
      name: 'STEP Program - 2025 Batch',
      startDate: new Date('2025-01-15'),
      instructorId: instructor._id
    });
    await cohort.save();

    // Create Interns
    const interns = [
      {
        fullName: 'Rajesh Singh',
        email: 'rajesh.singh@example.com',
        passwordHash: 'hashed_password',
        currentPhase: 'Instructor',
        currentMonth: 1,
        cohortId: cohort._id
      },
      {
        fullName: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        passwordHash: 'hashed_password',
        currentPhase: 'Instructor',
        currentMonth: 1,
        cohortId: cohort._id
      }
    ];

    await Intern.insertMany(interns);

    // Add interns to cohort
    const internIds = await Intern.find({ cohortId: cohort._id }).select('_id');
    cohort.interns = internIds.map(intern => intern._id);
    await cohort.save();

    console.log('User and cohort data seeded successfully!');

  } catch (error) {
    console.error('Error seeding user data:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();
