import express from 'express';
import AuthRoutes from './AuthRoutes.js';
import AIRoutes from './AIRoutes.js';
import NoteRoutes from './NoteRoutes.js';
import TaskRoutes from './TaskRoutes.js';
import UserRoutes from './UserRoutes.js';
import SubscriptionRoutes from './SubscriptionRoutes.js';
import NotificationRoutes from './NotificationRoutes.js';
const router = express.Router();

// API routes
router.use('/auth', AuthRoutes);
router.use('/users', UserRoutes);
router.use('/ai',AIRoutes);
router.use('/notes', NoteRoutes);
router.use('/tasks', TaskRoutes);
router.use('/subscription', SubscriptionRoutes);
router.use('/notifications', NotificationRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;