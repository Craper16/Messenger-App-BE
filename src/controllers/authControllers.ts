import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ErrorResponse } from '../app';
import { checkForValidationErrors } from '../helpers/validationHelpers';
import { UserModel } from '../models/user';
import {
  changeUserPassword,
  getUserData,
  refresh,
  SignIn,
  signUp,
  updateUser,
} from '../services/authServices';

export const SignUpUser: RequestHandler = async (req, res, next) => {
  const body = req.body as UserModel;
  try {
    checkForValidationErrors(validationResult(req));

    const signUpUser = await signUp({
      ...body,
    });

    if (signUpUser?.status !== 201) {
      const error: ErrorResponse = {
        message: signUpUser?.name!,
        name: signUpUser?.name!,
        status: signUpUser?.status!,
        data: {
          message: signUpUser?.message!,
          status: signUpUser?.status!,
        },
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
        message: signInUser?.name!,
        name: signInUser?.name!,
        status: signInUser?.status!,
        data: {
          message: signInUser?.message!,
          status: signInUser?.status!,
        },
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
        message: refreshUser?.name!,
        name: refreshUser?.name!,
        status: refreshUser?.status!,
        data: {
          message: refreshUser?.message!,
          status: refreshUser?.status!,
        },
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

export const GetUserData: RequestHandler = async (req, res, next) => {
  try {
    const data = await getUserData(req.userId);

    if (data?.status !== 200) {
      const error: ErrorResponse = {
        message: data?.name!,
        name: data?.name!,
        status: data?.status!,
        data: { message: data?.message!, status: data?.status! },
      };
      throw error;
    }

    return res.status(data.status).json({
      userId: data?.user?._id,
      email: data.user?.email,
      phoneNumber: data?.user?.phoneNumber,
      displayName: data.user?.displayName,
    });
  } catch (error) {
    next();
  }
};

export const GetUserDataById: RequestHandler = async (req, res, next) => {
  const { userId } = req.params as { userId: string };
  try {
    const data = await getUserData(userId);
    if (data?.status !== 200) {
      const error: ErrorResponse = {
        message: data?.name!,
        name: data?.name!,
        status: data?.status!,
        data: { message: data?.message!, status: data?.status! },
      };
      throw error;
    }

    return res.status(data.status).json({
      userId: data?.user?._id,
      email: data.user?.email,
      phoneNumber: data?.user?.phoneNumber,
      displayName: data.user?.displayName,
    });
  } catch (error) {
    next();
  }
};

export const ChangeUserPassword: RequestHandler = async (req, res, next) => {
  const { newPassword, oldPassword } = req.body as {
    oldPassword: string;
    newPassword: string;
  };
  try {
    const ChangePassword = await changeUserPassword({
      newPassword,
      oldPassword,
      userId: req.userId,
    });

    if (ChangePassword?.status !== 200) {
      const error: ErrorResponse = {
        message: ChangePassword?.name!,
        name: ChangePassword?.name!,
        status: ChangePassword?.status!,
        data: {
          message: ChangePassword?.message!,
          status: ChangePassword?.status!,
        },
      };
      throw error;
    }

    return res.status(ChangePassword.status).json({
      message: ChangePassword.message,
      userId: ChangePassword.user?._id,
      email: ChangePassword.user?.email,
      phoneNumber: ChangePassword.user?.phoneNumber,
      displayName: ChangePassword.user?.displayName,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateUserInfo: RequestHandler = async (req, res, next) => {
  const { displayName, phoneNumber } = req.body as {
    displayName: string;
    phoneNumber: number;
  };
  try {
    checkForValidationErrors(validationResult(req));

    const UpdateUser = await updateUser({
      displayName,
      phoneNumber,
      userId: req.userId,
    });

    if (UpdateUser?.status !== 200) {
      const error: ErrorResponse = {
        message: UpdateUser?.name!,
        name: UpdateUser?.name!,
        status: UpdateUser?.status!,
        data: {
          message: UpdateUser?.message!,
          status: UpdateUser?.status!,
        },
      };
      throw error;
    }

    return res.status(UpdateUser.status).json({
      message: UpdateUser.message,
      userId: UpdateUser.user?._id,
      email: UpdateUser.user?.email,
      phoneNumber: UpdateUser.user?.phoneNumber,
      displayName: UpdateUser.user?.displayName,
    });
  } catch (error) {
    next(error);
  }
};
