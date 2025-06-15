import express from 'express';
import { protect } from '../middleware/protect';
import { getMyProfile, updateMyProfile, deleteMyAccount, getUser, getAllUsers, userValidation } from '../controllers/UserController'; 
import { validateRequest } from '../middleware/validation';

 const router = express.Router();

 router.use(protect);
 router.get('/me', getMyProfile);
 router.patch('/me', validateRequest(userValidation.updateMe), updateMyProfile);
 router.delete('/me', deleteMyAccount);
 router.get('/:id', getUser);
 router.get('/', getAllUsers);
 
 export default router;