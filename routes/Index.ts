import express from 'express';
import AuthRoutes from './AuthRoutes';
import AIRoutes from './AIRoutes';
import NoteRoutes from './NoteRoutes';
import TaskRoutes from './TaskRoutes';

const router = express.Router();

// API routes
router.use('/auth', AuthRoutes);
router.use('/ai', AIRoutes);
router.use('/notes', NoteRoutes);
router.use('/tasks', TaskRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;