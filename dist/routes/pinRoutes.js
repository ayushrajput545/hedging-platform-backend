"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pin_1 = require("../controllers/pin");
const router = (0, express_1.Router)();
// FPO Dashboard Routes
router.get("/fpo/requests/:fpoId", pin_1.getRequestsForFPO);
router.post("/fpo/approve", pin_1.approveRequestByFPO);
// Buyer Dashboard Routes
router.get("/buyer/requests/:buyerId", pin_1.getRequestsForBuyer);
exports.default = router;
//# sourceMappingURL=pinRoutes.js.map