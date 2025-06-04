import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import generateToken from "../utils/generateToken.js";
import createSendCookie from "../utils/createSendCookie.js";
import { catchAsync, createError } from "../utils/errorHandler.js";

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(createError('Please provide email and password', 400));
    }
    
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
        return next(createError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    const token = await generateToken(user._id as string);
    createSendCookie({ res, name: "jwt", value: token });

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
});

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    
    // 1) Check if all fields are provided
    if (!username || !email || !password) {
        return next(createError('Please provide all required fields', 400));
    }
    
    // 2) Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(createError('Email already in use', 400));
    }

    // 3) Create new user
    const user = await User.create({
        username,
        email,
        password
    });

    // 4) Generate token and send response
    const token = await generateToken(user._id as string);
    console.log(' token', token);
    createSendCookie({ res, name: "jwt", value: token });
    
    // Remove password from output
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/'
    });
    
    res.status(200).json({
        status: 'success',
        message: 'Successfully logged out'
    });
});