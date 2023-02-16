import { Schema, model, ObjectId, Types } from 'mongoose';

export interface UserModel {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: number;
}

const userSchema = new Schema<UserModel>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
});

export const User = model<UserModel>('User', userSchema);
