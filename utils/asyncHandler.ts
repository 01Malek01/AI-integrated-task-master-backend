import { NextFunction, Request, Response, RequestHandler } from 'express';
import { createError } from './appError.js';

export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err instanceof Error) {
        next(createError(err.message, 500));
      } else {
        next(createError('An unknown error occurred', 500));
      }
    });
  };
};
