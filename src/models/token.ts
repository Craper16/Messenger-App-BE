import { Schema, model } from 'mongoose';

export interface tokenModel {
  blackListedToken: string;
}

const blackListedTokenSchema = new Schema<tokenModel>({
  blackListedToken: {
    type: String,
    required: true,
  },
});

export const BlackListedToken = model<tokenModel>(
  'BlackListedToken',
  blackListedTokenSchema
);
