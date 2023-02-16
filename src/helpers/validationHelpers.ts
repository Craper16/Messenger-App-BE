import { Result, ValidationError } from 'express-validator';
import { ErrorResponse } from '../app';

export const CheckForValidationErrors = (
  validationErrors: Result<ValidationError>
) => {
  if (!validationErrors.isEmpty()) {
    const error: ErrorResponse = {
      message: validationErrors
        .array()
        .map((error) => error.msg)
        .toString()
        .trim(),
      name: 'Invalid Data',
      status: 422,
    };
    throw error;
  }
};
