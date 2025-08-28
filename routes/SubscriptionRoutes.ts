import express from "express";
import {
  createCheckoutSession,
  getSubscriptions,
  stripeWebhookHandler,
} from "../controllers/SubscriptionController.js";
import { protect } from "../middleware/protect.js";
const router = express.Router();

router.post("/create-checkout-session/:id", protect, createCheckoutSession);
router.get("/", getSubscriptions);
router.post("/stripe-webhook", stripeWebhookHandler);

export default router;
