import User, { IUserDocument } from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import generateToken from "../utils/generateToken.js";
import createSendCookie from "../utils/createSendCookie.js";
import { createError } from "../utils/errorHandler.js";
import catchAsync from "express-async-handler";
import { stripe } from "../app.js";
import { IUser } from "../types/models.js";

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

    // 3) Create new user first to get the MongoDB _id
    const user: IUserDocument = await User.create({
        username,
        email,
        password
    });

    // 4) Create Stripe customer and link to the user
    const customer = await stripe.customers.create({
        email,
        name: username,
        metadata: {
            //@ts-ignore
            userId: user._id.toString() 
        }
    });

    // 5) Update user with Stripe customer ID
    user.stripeCustomerId = customer.id;
    await user.save();

    // 4) Generate token and send response
    const token = await generateToken(user._id as string);
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
    res.clearCookie("jwt");
    req.user = null;
    res.status(200).json({
        status: 'success',
        message: 'Successfully logged out'
    });
});

export const checkAuth  = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if(req?.user){
        const user = await User.findById(req.user._id);
        if(!user){
            return next(createError('User not found', 404));
        }   
        user.password = undefined;
        res.status(200).json({
            status: 'success',
            data: {
                user: user
            }
        });
    } else {    
        return next(createError('You are not logged in! please log in to get access', 401));
    }
})  
