import express from "express";
import { protect } from "../middleware/protect.js";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  getUser,
  getAllUsers,
  resetPasswordRequest,
  resetPassword
  
} from "../controllers/UserController.js";
import { validateRequest } from "../middleware/validation.js";
import { userValidation } from "../validations/userValidations.js";

const router = express.Router();



router.post("/reset-password", resetPasswordRequest);
router.post("/reset-password/:token", resetPassword);
router.use(protect);
router.get("/me", getMyProfile);
router.patch("/me", validateRequest(userValidation.updateMe), updateMyProfile);
router.delete("/me", deleteMyAccount);
router.get("/:id", getUser);
router.get("/", getAllUsers);


export default router;
