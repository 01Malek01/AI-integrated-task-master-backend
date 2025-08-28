import express from "express";
import { protect } from "../middleware/protect.js";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getUser,
  getAllUsers,
  userValidation,
} from "../controllers/UserController.js";
import { validateRequest } from "../middleware/validation.js";

const router = express.Router();

router.use(protect);
router.get("/me", getMyProfile);
router.patch("/me", validateRequest(userValidation.updateMe), updateMyProfile);
router.delete("/me", deleteMyAccount);
router.get("/:id", getUser);
router.get("/", getAllUsers);

export default router;
