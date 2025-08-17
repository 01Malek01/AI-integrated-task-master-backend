

import express from 'express';
import { createCheckoutSession, getSubscriptions, stripeWebhookHandler } from '../controllers/SubscriptionController';
import { protect } from '../middleware/protect';
const router = express.Router();

router.post('/create-checkout-session/:id',  protect ,  createCheckoutSession);
router.get ('/',getSubscriptions);
router.post('/stripe-webhook' ,stripeWebhookHandler);


export default router;