import {
  validationResult,
  ValidationChain,
  ValidationError as ExpressValidationError,
} from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createValidationError } from "../utils/appError.js";

interface FormattedError {
  field: string | symbol;
  value?: any;
  message: string;
  type?: string;
  location?: string;
}

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

      // Log the validation errors for debugging
      console.error("Validation errors:", errors.array());

      // Format errors in a more detailed way
      const formattedErrors = errors
        .array()
        .map((err: ExpressValidationError): FormattedError => {
          const field = "path" in err ? err.path : "unknown";
          const value = "value" in err ? err.value : undefined;
          const message = "msg" in err ? err.msg : "Validation error";
          const type = "type" in err ? err.type : "validation_error";

          // Create a base error object
          const errorObj: FormattedError = {
            field,
            value,
            message,
            type,
          };

          // Only add location if it exists
          if ("location" in err) {
            errorObj.location = err.location;
          }

          return errorObj;
        });

      // Create a validation error with the formatted errors
      next(createValidationError(formattedErrors));
    },
  ];
};
