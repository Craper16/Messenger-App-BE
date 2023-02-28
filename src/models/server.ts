import { model, ObjectId, Schema, Types } from 'mongoose';

interface MessageModel {
  content: string;
  receiver: ObjectId;
  sender: ObjectId;
  sentAt: Date;
}

export interface ServerModel {
  members: ObjectId[];
  name: string;
  owner: ObjectId;
  messages: MessageModel[];
}

const serverSchema = new Schema<ServerModel>({
  name: {
    type: String,
    required: true,
  },
  owner: { type: Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      type: Object,
    },
  ],
});

export const Server = model<ServerModel>('Server', serverSchema);
