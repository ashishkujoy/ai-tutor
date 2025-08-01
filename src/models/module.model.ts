import { Schema, model } from 'mongoose';

const moduleSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  topicId: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  targetMonth: { type: Number, required: true }
});

const Module = model('Module', moduleSchema);

export default Module;
