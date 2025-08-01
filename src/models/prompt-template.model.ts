import { Schema, model } from 'mongoose';

const promptTemplateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  interactionType: { type: String, enum: ['ExplainTopic', 'CodeReview', 'Hint', 'GeneralQuestion'], required: true },
  phase: { type: String, enum: ['Instructor', 'Collaborator', 'Catalyst'], required: true },
  template: { type: String, required: true },
  version: { type: Number, required: true },
  isActive: { type: Boolean, required: true },
  notes: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

export default model('PromptTemplate', promptTemplateSchema);
