import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ErrorResponse } from '../app';
import { checkForValidationErrors } from '../helpers/validationHelpers';
import { UserModel } from '../models/user';
import { refresh, SignIn, signUp } from '../services/authServices';

export const SignUpUser: RequestHandler = async (req, res, next) => {
  const body = req.body as UserModel;
  try {
    checkForValidationErrors(validationResult(req));

    const signUpUser = await signUp({
      ...body,
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

export const SignInUser: RequestHandler = async (req, res, next) => {
  const body = req.body as { email: string; password: string };
  try {
    checkForValidationErrors(validationResult(req));

    const signInUser = await SignIn({ ...body });

    if (signInUser?.status !== 200) {
      const error: ErrorResponse = {
        message: signInUser?.message!,
        name: signInUser?.name!,
        status: signInUser?.status!,
      };
      throw error;
    }

    return res.status(signInUser.status).json({
      access_token: signInUser.access_token,
      refresh_token: signInUser.refresh_token,
      userId: signInUser.user?._id,
      email: signInUser.user?.email,
      phoneNumber: signInUser.user?.phoneNumber,
      displayName: signInUser.user?.displayName,
    });
  } catch (error) {
    next(error);
  }
};

export const RefreshTokens: RequestHandler = async (req, res, next) => {
  const { refresh_token } = req.body as { refresh_token: string };

  try {
    const refreshUser = await refresh(refresh_token);

    if (refreshUser?.status !== 200) {
      const error: ErrorResponse = {
        message: refreshUser?.message!,
        name: refreshUser?.name!,
        status: refreshUser?.status!,
      };
      throw error;
    }

    return res.status(refreshUser.status).json({
      access_token: refreshUser.access_token,
      refresh_token: refreshUser.refresh_token,
      userId: refreshUser.user?._id,
      email: refreshUser.user?.email,
      phoneNumber: refreshUser.user?.phoneNumber,
      displayName: refreshUser.user?.displayName,
    });
  } catch (error) {
    next(error);
  }
};
