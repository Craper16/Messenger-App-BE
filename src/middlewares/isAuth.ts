import { RequestHandler } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

import { ErrorResponse } from '../app';

export const isAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      const error: ErrorResponse = {
        message: 'Unauthenticated',
        name: 'Unauthenticated',
        status: 401,
      };
      throw error;
    }
    const access_token = authHeader.split(' ')[1];

    let decoded_token;
    let decoded_tokenErrors:
      | { message: string; name: string; status: number }
      | undefined = undefined;

    try {
      decoded_token = await verify(access_token, process.env.SECRET);
    } catch (error) {
      const { message, name } = error as Error;
      decoded_tokenErrors = {
        message: message,
        name: name,
        status: 409,
      };
    }

    if (!decoded_token) {
      const error: ErrorResponse = {
        message: 'Unauthorized',
        name: 'Unauthorized',
        status: 401,
      };
      throw error;
    }

    if (decoded_tokenErrors) {
      const error: ErrorResponse = {
        message: decoded_tokenErrors.message,
        name: decoded_tokenErrors.name,
        status: decoded_tokenErrors.status,
      };
      throw error;
    }

    const { userId } = decoded_token as JwtPayload;
    req.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
};
