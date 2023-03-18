import { check } from 'express-validator';

export const addServerValidations = [
  check('name')
    .isString()
    .withMessage('Please enter a string')
    .notEmpty()
    .withMessage('Server name must not be empty')
    .isLength({ min: 4, max: 20 })
    .withMessage('Server name must be between 4 and 20 characters'),
];

export const updateServerValidations = [
  check('newServerName')
    .isString()
    .withMessage('Please enter a string')
    .notEmpty()
    .withMessage('Server name must not be empty')
    .isLength({ min: 4, max: 20 })
    .withMessage('Server name must be between 4 and 20 characters'),
];
