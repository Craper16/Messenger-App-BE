import { sign } from 'jsonwebtoken';
import { BlackListedToken } from '../models/blacklistedToken';

interface userJWTSignData {
  email: string;
  phoneNumber: number;
  displayName: string;
  _id: string;
  grant_type: string;
}

export const generateAccess_Token = ({
  _id,
  email,
  displayName,
  phoneNumber,
  grant_type,
}: userJWTSignData) => {
  return sign(
    {
      userId: _id,
      email: email,
      displayName: displayName,
      phoneNumber: phoneNumber,
      grant_type: grant_type,
    },
    process.env.SECRET,
    { expiresIn: '1h' }
  );
};

export const generateRefresh_Token = ({
  _id,
  email,
  displayName,
  phoneNumber,
  grant_type,
}: userJWTSignData) => {
  return sign(
    {
      userId: _id,
      email: email,
      displayName: displayName,
      phoneNumber: phoneNumber,
      grant_type: grant_type,
    },
    process.env.SECRET,
    {
      expiresIn: '365d',
    }
  );
};

export const blacklistRefresh_Token = async (refresh_token: string) => {
  const blackListedToken = await new BlackListedToken({
    blackListedToken: refresh_token,
  });

  await blackListedToken.save();
};
