"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../middleware/Auth");
const farmer_1 = require("../controllers/farmer");
const router = (0, express_1.Router)();
router.get('/get-farmer-info', Auth_1.auth, farmer_1.getFarmerProfile);
exports.default = router;
//# sourceMappingURL=farmerRoutes.js.map