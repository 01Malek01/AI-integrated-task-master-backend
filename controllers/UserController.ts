import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import { createError } from '../utils/appError.js';
import asyncHandler from 'express-async-handler';
import Email from '../services/EmailService.js';




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
    updatedUser.__v= undefined as any;
    
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


export const resetPasswordRequest = asyncHandler(async(req,res,next) => {
  //1) generate a unique token
  const token = crypto.randomUUID();

  //2) store token in database
 const user = await User.findOne({email:req.body.email})

 if(!user){
    return next(createError('User not found', 404));
 }

 user.passwordResetToken = token;
 user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes
 await user.save({ validateBeforeSave: false });

  //3) send email to the user with a link redirecting to an update password page and the link contains the token
 const mail = new Email( user, `${process.env.FRONTEND_URL}/reset-password/${token}`)
 await mail.sendPasswordReset();
 res.status(200).json({
    status: 'success',
    message: 'Password reset email sent'
 })

})



export const resetPassword = asyncHandler(async(req,res,next) => {
  //1) get token from url
  const token = req.params.token;
  //2) find user by token
  
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gte: new Date() }
  }).select('+passwordResetToken +passwordResetExpires');
  
  console.log('Found user:', user);
  if (user) {
    console.log('Token expires at:', user.passwordResetExpires);
  }

  //3) check if token is expired
  if(!user ){
    return next(createError('Token is expired', 400));
  }

  //4) update password
  user.password = req.body.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  //5) send response
  res.status(200).json({
    status: 'success',
    user
  });
})













