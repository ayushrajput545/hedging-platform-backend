import { Router } from "express";
import { acceptTrade, createTradeBlockchain, getContractById, getContracts } from "../controllers/Contarcts";
import { auth } from "../middleware/Auth";
 

const router: Router = Router();

// /api/contracts
router.get("/get-contract", auth, getContracts);
router.post("/create-contract",auth, createTradeBlockchain);
router.get("/get-single-contract/:id",auth, getContractById);
router.post("/accept-trade/:id",auth,acceptTrade)
 

export default router;
