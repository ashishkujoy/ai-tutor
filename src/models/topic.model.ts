import { Schema, model } from 'mongoose';

const topicSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  skillProfileKey: { type: String, required: true }
});

const Topic = model('Topic', topicSchema);

export default Topic;
