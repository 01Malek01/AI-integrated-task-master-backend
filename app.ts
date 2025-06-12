import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { globalErrorHandler } from './utils/errorHandler.js';
import routeAggregator from './routes/index.js';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware

// HTTP request logger middleware for node.js (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, origin?: string | boolean) => void) => {
    // For development, allow requests from localhost:3000 with or without trailing slash
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3000/'
    ];
    
    // In production, you can add your production domain here
    if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
      if (process.env.FRONTEND_URL.endsWith('/')) {
        allowedOrigins.push(process.env.FRONTEND_URL.slice(0, -1));
      } else {
        allowedOrigins.push(`${process.env.FRONTEND_URL}/`);
      }
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // Return the origin instead of true for dynamic origin
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

//TODO :  apply rate limiter for login and other routes. apply CSRF protection and other security middlewares

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/auth/login', limiter);
app.use('/api/auth/register', limiter);
  // Routes
app.use('/api', routeAggregator);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found'
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  globalErrorHandler(err, req, res, next);
});

export default app;
