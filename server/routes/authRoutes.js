// routes/authRoutes.js
import express from "express";
import {
  sendLoginOTP,
  verifyLoginOTP,
  completeProfile,
} from "../controller/authController.js";

const router = express.Router();

router.post("/send-otp", sendLoginOTP);
router.post("/verify-otp", verifyLoginOTP);
router.post("/complete-profile", completeProfile);

export default router;
