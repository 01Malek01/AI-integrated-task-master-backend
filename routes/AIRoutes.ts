import { 
  summarizeTask, 
  assistantResponse, 
  generateSubtasks 
} from '../controllers/AIController';
import { Router } from 'express';
import { protect } from '../middleware/protect';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Apply protect middleware to all routes
router.use(protect);

// Summarize text
router.post(
  '/summarize', 
  validateRequest([
    body('text').notEmpty().withMessage('Text is required')
  ]),
  summarizeTask
);

// Get AI assistant response
router.post(
  '/assistant',
  validateRequest([
    body('message').notEmpty().withMessage('Message is required')
  ]),
  assistantResponse
);

// Generate subtasks for a task
router.post(
  '/generate-subtasks',
  validateRequest([
    body('title').notEmpty().withMessage('Task title is required')
  ]),
  generateSubtasks
);

export default router;