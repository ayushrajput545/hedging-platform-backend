import { Router } from "express";
import { createUser, generateOtp, verifyOtp } from "../controllers/auth";

const router = Router()

router.post("/send-otp", generateOtp)
router.post('/verify-otp',verifyOtp)
router.post('/create-user',createUser)

export default router;

