import { Schema, model, ObjectId } from 'mongoose';

export interface MessageModel {
  content: string;
  sender: ObjectId;
  receiver: ObjectId;
}

const messageSchema = new Schema<MessageModel>(
  {
    content: { type: String, required: true },
    sender: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = model<MessageModel>('Message', messageSchema);
