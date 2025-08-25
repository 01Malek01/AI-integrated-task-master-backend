import { Router } from 'express';
import { 
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications
} from '../controllers/NotificationController';
import { protect } from '../middleware/protect';

const router = Router();

router.use(protect);

router.get('/', getNotifications);

router.patch('/read', markAsRead);

router.delete('/:id', deleteNotification);

router.delete('/', clearAllNotifications);

export default router;