
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  __v: number;
}

const userSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export default model<IUser>('User', userSchema);
