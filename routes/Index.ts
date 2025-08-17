import express from 'express';
import AuthRoutes from './AuthRoutes';
import AIRoutes from './AIRoutes';
import NoteRoutes from './NoteRoutes';
import TaskRoutes from './TaskRoutes';
import UserRoutes from './UserRoutes';
import SubscriptionRoutes from './SubscriptionRoutes';
const router = express.Router();

// API routes
router.use('/auth', AuthRoutes);
router.use('/users', UserRoutes);
router.use('/ai', AIRoutes);
router.use('/notes', NoteRoutes);
router.use('/tasks', TaskRoutes);
router.use('/subscription', SubscriptionRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;