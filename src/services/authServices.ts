import {
  generateAccess_Token,
  generateRefresh_Token,
} from '../helpers/jwtHelpers';
import { hash } from 'bcryptjs';

import { User, UserModel } from '../models/user';

export const signUp = async (data: UserModel) => {
  const { displayName, email, password, phoneNumber } = data;

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
      access_token: access_token,
      refresh_token: refresh_token,
      status: 201,
    };
  } catch (error) {
    console.error(error);
  }
};
