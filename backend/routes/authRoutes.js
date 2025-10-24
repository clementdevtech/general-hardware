import express from "express";
import {
  checkuser,
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();


router.get("/check-user", authMiddleware, checkuser);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);

export default router;

