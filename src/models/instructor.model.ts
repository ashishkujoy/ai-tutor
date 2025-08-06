import { Schema, model } from 'mongoose';

const instructorSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Instructor', instructorSchema);
