import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import { createError } from '../utils/appError';
import asyncHandler from 'express-async-handler';

// @desc    Get current user profile
// @route   GET /users/me
// @access  Private
export const getMyProfile = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id).select('-password -__v');
    
    if (!user) {
        return next(createError('User not found', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// @desc    Update user profile
// @route   PATCH /users/me
// @access  Private
export const updateMyProfile = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const { username, email } = req.body;
    
    // 1) Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(createError('User not found', 404));
    }
    
    // 2) Update user data
    if (username) user.username = username;
    if (email) user.email = email;
    
    // 3) Save user
    const updatedUser = await user.save({ validateModifiedOnly: true });
    
    // 4) Remove sensitive data
    updatedUser.password = undefined;
    updatedUser.__v = undefined;
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// @desc    Delete user account
// @route   DELETE /users/me
// @access  Private
export const deleteMyAccount = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { active: false },
        { new: true, runValidators: true }
    );
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

// @desc    Get user by ID (Admin only)
// @route   GET /users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id).select('-password -__v');
    
    if (!user) {
        return next(createError('User not found', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});

// @desc    Get all users (Admin only)
// @route   GET /users
// @access  Private/Admin
export const getAllUsers =  asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find().select('-password -__v');
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

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
    ]
};