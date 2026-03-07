"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Contarcts_1 = require("../controllers/Contarcts");
const Auth_1 = require("../middleware/Auth");
const router = (0, express_1.Router)();
// /api/contracts
router.get("/get-contract", Auth_1.auth, Contarcts_1.getContracts);
router.post("/create-contract", Auth_1.auth, Contarcts_1.createTradeBlockchain);
router.get("/get-single-contract/:id", Auth_1.auth, Contarcts_1.getContractById);
router.post("/accept-trade/:id", Contarcts_1.acceptTrade);
router.get("/ledger", Contarcts_1.getLedger);
router.put("/update-contract/:id", Contarcts_1.updateContract);
router.put("/approve-negotiation/:id", Contarcts_1.approveNegotiation);
router.put("/reject-negotiation/:id", Contarcts_1.rejectNegotiation);
exports.default = router;
//# sourceMappingURL=contractsRoutes.js.map