import { RequestHandler } from 'express';
import { ErrorResponse } from '../app';
import {
  getAllMessages,
  getMessageInfo,
  sendMessage,
} from '../services/messageServices';
import {} from 'socket.io';

export const SendMessage: RequestHandler = async (req, res, next) => {
  const { content } = req.body as { content: string };
  const { receiver } = req.params as { receiver: string };
  try {
    const sendMessageToUser = await sendMessage({
      content,
      receiver,
      sender: req.userId,
    });

    if (sendMessageToUser?.status !== 201) {
      const error: ErrorResponse = {
        message: sendMessageToUser?.name!,
        name: sendMessageToUser?.name!,
        status: sendMessageToUser?.status!,
        data: {
          message: sendMessageToUser?.message!,
          status: sendMessageToUser?.status!,
        },
      };
      throw error;
    }

    return res.status(sendMessageToUser.status);
  } catch (error) {
    next(error);
  }
};
