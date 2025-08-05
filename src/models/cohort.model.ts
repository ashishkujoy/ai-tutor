import { Schema, model } from 'mongoose';

const cohortSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  instructorId: { type: Schema.Types.ObjectId, ref: 'Instructor' },
  interns: [{ type: Schema.Types.ObjectId, ref: 'Intern' }],
});

export default model('Cohort', cohortSchema);
