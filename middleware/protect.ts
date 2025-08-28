import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Consider defining a proper user type
    }
  }
}

interface JwtPayload {
  userId: string;
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    // Get token from cookie or Authorization header
    token =
      req.cookies?.jwt ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    // No token provided
    if (!token) {
      return next(new Error("Not authorized, no token. Please log in."));
    }

    try {
      // Check for JWT_SECRET
      if (!process.env.JWT_SECRET) {
        return next(new Error("JWT_SECRET is not defined"));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      // Get user from token
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      if (error instanceof jwt.TokenExpiredError) {
        return next(new Error("Token has expired. Please log in again."));
      } else if (error instanceof jwt.JsonWebTokenError) {
        return next(new Error("Invalid token. Please log in again."));
      }
      next(new Error("Not authorized"));
    }
  }
);

export { protect };
