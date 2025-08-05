import { Schema, model } from 'mongoose';

const instructorSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Instructor', instructorSchema);
