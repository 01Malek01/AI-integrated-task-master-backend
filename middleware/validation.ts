import { validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils/appError';

/**
 * Helper function to create validation middleware
 * @param validations Array of express-validator validation chains
 * @returns Array of middleware functions including the validation result handler
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return [
    ...validations,
    (req: Request, _res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      const errorMessages = errors.array().map(err => ({
        field: 'path' in err ? err.path : 'unknown',
        message: 'msg' in err ? err.msg : 'Validation error'
      }));
      next(createError('Validation failed', 400, { errors: errorMessages }));
    }
  ];
};
