import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ErrorResponse } from '../app';
import { CheckForValidationErrors } from '../helpers/validationHelpers';
import { UserModel } from '../models/user';
import { signUp } from '../services/authServices';

const errorFormatter = ({ msg }: any) => {
  return { msg };
};

export const SignUpUser: RequestHandler = async (req, res, next) => {
  const { displayName, email, password, phoneNumber } = req.body as UserModel;
  try {
    CheckForValidationErrors(validationResult(req));

    const signUpUser = await signUp({
      displayName,
      email,
      password,
      phoneNumber,
    });

    if (signUpUser?.status !== 201) {
      const error: ErrorResponse = {
        message: signUpUser?.message!,
        name: signUpUser?.name!,
        status: signUpUser?.status!,
      };
      throw error;
    }

    return res.status(signUpUser.status).json({
      access_token: signUpUser.access_token,
      refresh_token: signUpUser.refresh_token,
      userId: signUpUser.user?._id,
      email: signUpUser.user?.email,
      phoneNumber: signUpUser.user?.phoneNumber,
      displayName: signUpUser.user?.displayName,
    });
  } catch (error) {
    next(error);
  }
};
