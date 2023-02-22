import { Message, MessageModel } from '../models/message';
import { User } from '../models/user';

export const sendMessage = async ({
  content,
  receiver,
  sender,
}: {
  content: string;
  receiver: string;
  sender: string;
}) => {
  try {
    const userSender = await User.findById(sender);
    const userReceiver = await User.findById(receiver);

    if (!userSender) {
      return { message: 'Sender not found', name: 'Not Found', status: 404 };
    }

    if (!userReceiver) {
      return { message: 'Receiver not found', name: 'Not Found', status: 404 };
    }

    return {
      sender: sender,
      receiver: receiver,
      content: content,
      status: 201,
    };
  } catch (error) {
    console.error(error);
  }
};

export const getAllMessages = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { message: 'User not found', name: 'Not Found', status: 404 };
    }

    const messages = await Message.find({ sender: user._id });

    return { allMessages: messages, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const getMessageInfo = async (messageId: string) => {
  try {
    const message = Message.findById(messageId);

    if (!message) {
      return { message: 'Message not found', name: 'Not Found', status: 404 };
    }

    return { messageInfo: message, status: 200 };
  } catch (error) {
    console.error(error);
  }
};
