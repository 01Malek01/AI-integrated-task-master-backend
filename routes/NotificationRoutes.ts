import { 
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications
} from '../controllers/NotificationController.js';
import { protect } from '../middleware/protect.js';
import express from 'express';

const router = express.Router();
  
router.use(protect);


//@ts-ignore
router.get('/', getNotifications);

//@ts-ignore
router.patch('/read', markAsRead);

//@ts-ignore
router.delete('/:id', deleteNotification);

//@ts-ignore
router.delete('/', clearAllNotifications);

export default router;