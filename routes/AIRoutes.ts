import {
  summarizeTask,
  assistantResponse,
  generateSubtasks,
  generateDescription,
} from "../controllers/AIController.js";
import { Router } from "express";
import { protect } from "../middleware/protect.js";
import { validateRequest } from "../middleware/validation.js";
import { body } from "express-validator";
import checkProSubscription from "@/middleware/checkSubscription.js";

const router = Router();

// Apply protect middleware to all routes
router.use(protect);
router.use(checkProSubscription);

// Summarize text
router.post(
  "/summarize",
  validateRequest([body("text").notEmpty().withMessage("Text is required")]),
  summarizeTask
);

// Get AI assistant response
router.post(
  "/assistant",
  validateRequest([
    body("message").notEmpty().withMessage("Message is required"),
  ]),
  assistantResponse
);
router.post(
  "/generate-description",
  validateRequest([
    body("title").notEmpty().withMessage("Task title is required"),
  ]),
  generateDescription
);

// Generate subtasks for a task
router.post(
  "/generate-subtasks",
  validateRequest([
    body("title").notEmpty().withMessage("Task title is required"),
  ]),
  generateSubtasks
);

export default router;
