import { model, ObjectId, Schema, Types } from 'mongoose';
export interface MessageModel {
  content: string;
  serverId: string;
  serverName: string;
  sender: {
    _id: string;
    displayName: string;
    phoneNumber: number;
    email: string;
  };
  sentAt: Date;
}

export interface ServerModel {
  members: ObjectId[];
  name: string;
  owner: ObjectId;
  messages: MessageModel[];
  _id: string;
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
