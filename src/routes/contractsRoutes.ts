import { Router } from "express";
import { acceptTrade, approveNegotiation, createTradeBlockchain, getContractById, getContracts, getLedger, rejectNegotiation, updateContract } from "../controllers/Contarcts";
import { auth } from "../middleware/Auth";
 

const router: Router = Router();

// /api/contracts
router.get("/get-contract", auth, getContracts);
router.post("/create-contract",auth, createTradeBlockchain);
router.get("/get-single-contract/:id",auth, getContractById);
router.post("/accept-trade/:id",acceptTrade)
router.get("/ledger", getLedger);
router.put("/update-contract/:id", updateContract);
router.put("/approve-negotiation/:id", approveNegotiation);
router.put("/reject-negotiation/:id", rejectNegotiation);

 

export default router;
