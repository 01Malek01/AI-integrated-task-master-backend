import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routeAggregator from './routes/index.js';
import { globalErrorHandler } from './utils/errorHandler.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

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
