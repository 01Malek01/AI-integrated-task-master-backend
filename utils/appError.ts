interface ErrorData {
  code?: string;
  errors?: any[];
  timestamp?: string;
  [key: string]: any;
}

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: string;
  errors?: any[];
  timestamp: string;

  constructor(
    message: string, 
    statusCode: number, 
    data: ErrorData = {}
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = data.code;
    this.errors = data.errors;
    this.timestamp = data.timestamp || new Date().toISOString();

    // Copy other properties from data to the error object
    Object.keys(data).forEach(key => {
      if (!(key in this)) {
        (this as any)[key] = data[key];
      }
    });

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a validation error
   */
  static validationError(message: string, errors: any[]) {
    return new AppError(
      message, 
      400, 
      { 
        code: 'VALIDATION_ERROR',
        errors,
        timestamp: new Date().toISOString()
      }
    );
  }
}

/**
 * Factory function to create application errors
 */
export const createError = (
  message: string, 
  statusCode: number = 500, 
  data: ErrorData = {}
): AppError => {
  return new AppError(message, statusCode, data);
};

/**
 * Helper to create validation errors from express-validator
 */
export const createValidationError = (errors: any[]) => {
  return AppError.validationError(
    errors.length === 1 
      ? `Validation error: ${errors[0].message}`
      : `Multiple validation errors (${errors.length})`,
    errors
  );
};
