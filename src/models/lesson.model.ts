import { Schema, model } from 'mongoose';

const lessonSchema = new Schema({
  name: { type: String, required: true },
  objective: { type: String, required: true },
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  dayOfMonth: { type: Number, required: true },
  learningContentUrl: { type: String, required: true },
  dailyChallenge: { type: String, required: true },
  solutionCode: { type: String, required: true },
});

export default model('Lesson', lessonSchema);
