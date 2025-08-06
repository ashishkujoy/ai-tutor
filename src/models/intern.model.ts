import { Schema, model } from 'mongoose';

const internSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  currentPhase: { type: String, enum: ['Instructor', 'Collaborator', 'Catalyst'], required: true },
  currentMonth: { type: Number, required: true },
  cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort' },
  createdAt: { type: Date, default: Date.now },
});

export default model('Intern', internSchema);
