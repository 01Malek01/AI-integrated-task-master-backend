import { Request, Response, NextFunction } from 'express';
import { createError } from './appError';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  errors?: Record<string, any>;
  keyValue?: Record<string, any>;
}

export { createError };

export const globalErrorHandler = (err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  // Default status code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    const errors: Record<string, string> = {};
    Object.values((err as any).errors).forEach((error: any) => {
      errors[error.path] = error.message;
    });
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors
    });
  }

  // Handle duplicate field errors (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(400).json({
      status: 'fail',
      message: `Duplicate field value: ${field}. Please use another value.`
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please log in again.'
    });
  }

  // Development error handling
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Production error handling
  return res.status(err.statusCode).json({
    status: err.status,
    message: 'Something went wrong!'
  });
};

// Catch async errors and pass them to the error handler
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
