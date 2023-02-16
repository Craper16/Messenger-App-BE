import {
  generateAccess_Token,
  generateRefresh_Token,
} from '../helpers/jwtHelpers';
import { hash, compare } from 'bcryptjs';

import { User, UserModel } from '../models/user';
import { JwtPayload, verify } from 'jsonwebtoken';

export const signUp = async ({
  displayName,
  email,
  password,
  phoneNumber,
}: UserModel) => {
  try {
    let user = await User.findOne({ email: email });
    const userPhoneCheck = await User.findOne({ phoneNumber: phoneNumber });

    if (user) {
      return {
        message: 'A User with this email already exists',
        name: 'Already Exists',
        status: 403,
      };
    }

    if (userPhoneCheck) {
      return {
        message: 'A user with this phoneNumber already exists',
        name: 'Already Exists',
        status: 403,
      };
    }

    const hashedPassword = await hash(password, 12);

    user = new User({
      email,
      password: hashedPassword,
      displayName,
      phoneNumber,
    });

    const result = await user.save();

    const access_token = generateAccess_Token({
      _id: result._id.toString(),
      displayName: result.displayName,
      email: result.email,
      phoneNumber: result.phoneNumber,
    });

    const refresh_token = generateRefresh_Token({
      _id: result._id.toString(),
      displayName: result.displayName,
      email: result.email,
      phoneNumber: result.phoneNumber,
    });

    return {
      user: result,
      access_token,
      refresh_token,
      status: 201,
    };
  } catch (error) {
    console.error(error);
  }
};

export const SignIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return {
        message: 'Please check your login credentials',
        name: 'Unauthorized',
        status: 401,
      };
    }

    const IsCorrectPassword = await compare(password, user.password);

    if (!IsCorrectPassword) {
      return {
        message: 'Please check your login credentials',
        name: 'Unauthorized',
        status: 401,
      };
    }

    const access_token = generateAccess_Token({
      _id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    const refresh_token = generateRefresh_Token({
      _id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    return { access_token, refresh_token, user, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const refresh = async (token: string) => {
  try {
    let verifiedUserId;

    let isTokenVerified:
      | { message: string; name: string; status: number }
      | undefined = undefined;

    await verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return (isTokenVerified = {
          message: error.message,
          name: error.name,
          status: 401,
        });
      }
      const { userId } = decoded as JwtPayload;
      verifiedUserId = userId;
    });

    if (isTokenVerified) {
      return isTokenVerified;
    }

    const user = await User.findById(verifiedUserId);

    if (!user) {
      return { message: 'No user found', name: 'Not found', status: 404 };
    }

    const access_token = generateAccess_Token({
      _id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    const refresh_token = generateRefresh_Token({
      _id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    return { access_token, refresh_token, user, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const getUserData = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { message: 'User not found', name: 'Not Found', status: 404 };
    }

    return { user: user, status: 200 };
  } catch (error) {
    console.error(error);
  }
};

export const changeUserPassword = async ({
  oldPassword,
  newPassword,
  userId,
}: {
  oldPassword: string;
  newPassword: string;
  userId: string;
}) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { message: 'User not found', name: 'Not Found', status: 404 };
    }

    const isCorrectOldPassword = await compare(oldPassword, user.password);

    if (!isCorrectOldPassword) {
      return {
        message: 'Incorrect old password entered',
        name: 'Forbidden',
        status: 403,
      };
    }

    const hashedNewPassword = await hash(newPassword, 12);

    user.password = hashedNewPassword;

    const result = await user.save();

    return {
      user: result,
      status: 200,
      message: 'Password changed successfully',
    };
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async ({
  displayName,
  phoneNumber,
  userId,
}: {
  userId: string;
  displayName: string;
  phoneNumber: number;
}) => {
  try {
    const user = await User.findById(userId);
    const usersWithSameNumber = await User.find({
      phoneNumber: phoneNumber,
    });

    const existsUsersWithSamePhoneNumber = usersWithSameNumber.filter(
      (sameUser) => sameUser._id.toString() !== user?._id.toString()
    );

    if (!user) {
      return { message: 'User not found', name: 'Not Found', status: 404 };
    }

    if (existsUsersWithSamePhoneNumber.length !== 0) {
      return {
        message: 'A user with this phone number already exists',
        name: 'Forbiden',
        status: 403,
      };
    }

    user.displayName = displayName;
    user.phoneNumber = phoneNumber;

    const result = await user.save();

    return {
      user: result,
      status: 200,
      message: 'Information updated successfully',
    };
  } catch (error) {
    console.error(error);
  }
};
