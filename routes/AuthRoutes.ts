import { Router } from "express";
import {
  login,
  register,
  logout,
  checkAuth,
} from "../controllers/AuthController.js";
import { validateRequest } from "../middleware/validation.js";
import { body } from "express-validator";
import { protect } from "../middleware/protect.js";

const router = Router();

// Validation rules
const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

// POST /api/auth/register - Register a new user
router.post("/register", validateRequest(registerValidation), register);

// POST /api/auth/login - Login user
router.post("/login", validateRequest(loginValidation), login);

// POST /api/auth/logout - Logout user
router.post("/logout", logout);

// GET /api/auth/checkAuth - Check if user is authenticated
router.get("/checkAuth", protect, checkAuth);
export default router;
