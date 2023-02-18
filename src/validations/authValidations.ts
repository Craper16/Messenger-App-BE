import { check } from 'express-validator';

export const SignUpValidations = [
  check('email')
    .isEmail()
    .withMessage('Invalid Email Address')
    .notEmpty()
    .withMessage('Email is required')
    .toLowerCase()
    .trim(),
  check('password')
    .isString()
    .withMessage('Password must be a string')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
    )
    .withMessage(
      'Password must contain 8 or more characters, with 1 upper case, 1 lower case and a special character'
    )
    .notEmpty()
    .withMessage('Password is required'),
  check('displayName')
    .isString()
    .withMessage('Display name must be a string')
    .notEmpty()
    .withMessage('Display name is required')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 13 })
    .withMessage('Display name must be between 3 and 13 characters long'),
  check('phoneNumber')
    .isNumeric()
    .withMessage('Phone number must be a number')
    .notEmpty()
    .withMessage('Phone number must not be empty')
    .isLength({ max: 8, min: 8 })
    .withMessage('Phone number must be 8 numbers'),
];

export const SignInValidations = [
  check('email')
    .isEmail()
    .withMessage('Invalid email entered')
    .notEmpty()
    .withMessage('Email must not be empty')
    .toLowerCase()
    .trim(),
  check('password')
    .isString()
    .withMessage('Password must be a string')
    .notEmpty()
    .withMessage('Password must not be empty'),
];

export const UpdateUserValidations = [
  check('displayName')
    .isString()
    .withMessage('Display name must be a string')
    .notEmpty()
    .withMessage('Display name is required')
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 13 })
    .withMessage('Display name must be between 3 and 13 characters long'),
  check('phoneNumber')
    .isNumeric()
    .withMessage('Phone number must be a number')
    .notEmpty()
    .withMessage('Phone number must not be empty')
    .isLength({ max: 8 })
    .withMessage('Phone number must not exceed 8 numbers'),
];
