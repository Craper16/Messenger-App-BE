import { sign } from 'jsonwebtoken';

interface userJWTSignData {
  email: string;
  phoneNumber: number;
  displayName: string;
  _id: string;
}

export const generateAccess_Token = ({
  _id,
  email,
  displayName,
  phoneNumber,
}: userJWTSignData) => {
  return sign(
    {
      userId: _id,
      email: email,
      displayName: displayName,
      phoneNumber: phoneNumber,
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
}: userJWTSignData) => {
  return sign(
    {
      userId: _id,
      email: email,
      displayName: displayName,
      phoneNumber: phoneNumber,
    },
    process.env.SECRET,
    {
      expiresIn: '365d',
    }
  );
};
