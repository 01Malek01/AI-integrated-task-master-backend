import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { globalErrorHandler } from './utils/errorHandler.js';
import rateLimit from 'express-rate-limit';
import Stripe from 'stripe';
import routeAggregator from './routes/Index.js';
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust first proxy (for rate limiting behind reverse proxy like Nginx)
app.set('trust proxy', 1);

//stripe config
export const stripe = new Stripe(process.env.STRIPE_API_SECRET as string);




// Middleware

// HTTP request logger middleware for node.js (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cookieParser());

// Parse application/json
app.use((req, res, next) => {
  console.log(' req.originalUrl',req.originalUrl)
  //stripe will use raw body for webhook
  if (req.originalUrl === '/api/subscription/stripe-webhook') {
    bodyParser.raw({ type: 'application/json' })(req, res, next);
   } else {
    bodyParser.json()(req, res, next);
  }
});
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variable or use default development origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map((o: string) => o.trim())
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          process.env.FRONTEND_URL
        ].filter(Boolean) as string[];

    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS error: ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
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

app.use('/health',(_req:Request, res:Response) => res.send('ok'));
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
