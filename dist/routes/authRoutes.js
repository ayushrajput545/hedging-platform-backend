"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
router.post("/send-otp", auth_1.generateOtp);
router.post('/verify-otp', auth_1.verifyOtp);
router.post('/create-user', auth_1.createUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map