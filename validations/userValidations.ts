
import { body } from "express-validator";

export const userValidation = {
    updateMe: [
        body('username')
            .optional()
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long')
            .isLength({ max: 30 })
            .withMessage('Username must be less than 30 characters'),
        body('email')
            .optional()
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail()
    ],
    updatePassword :[
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/[0-9]/)
            .withMessage('Password must contain at least one number')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter'),
        body('confirmPassword')
            .notEmpty()
            .withMessage('Confirm password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            })
    ]
};
