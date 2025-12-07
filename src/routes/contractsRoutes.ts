import { Router } from "express";
import { createContract, getContractById, getContracts } from "../controllers/Contarcts";
import { auth } from "../middleware/Auth";
 

const router: Router = Router();

// /api/contracts
router.get("/get-contract", auth, getContracts);
router.post("/create-contract",auth, createContract);
router.get("/get-single-contract/:id",auth, getContractById);
 

export default router;
