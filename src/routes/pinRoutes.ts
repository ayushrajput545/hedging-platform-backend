import { Router } from "express";
import { createUser, generateOtp, verifyOtp } from "../controllers/auth";
import { approveRequestByFPO, getRequestsForBuyer, getRequestsForFPO } from "../controllers/pin";

const router = Router()

// FPO Dashboard Routes
router.get("/fpo/requests/:fpoId", getRequestsForFPO);
router.post("/fpo/approve", approveRequestByFPO);

// Buyer Dashboard Routes
router.get("/buyer/requests/:buyerId", getRequestsForBuyer);


export default router;