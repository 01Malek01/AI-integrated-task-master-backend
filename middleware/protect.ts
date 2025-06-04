import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Consider defining a proper user type
    }
  }
}

interface JwtPayload {
  id: string;
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        if (!process.env.JWT_SECRET) {
          res.status(500);
          throw new Error('JWT_SECRET is not defined');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
          res.status(401);
          throw new Error('User not found');
        }

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

export { protect };
