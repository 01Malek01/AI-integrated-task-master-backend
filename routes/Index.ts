// Route aggregator will be defined here
import express from 'express';
import AuthRoutes from './authRoutes.js';
const router = express.Router();
router.use('/auth', AuthRoutes)

export default router