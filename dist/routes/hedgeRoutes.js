"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../middleware/Auth");
const hedge_1 = require("../controllers/hedge");
const router = express_1.default.Router();
router.post("/create-hedge", Auth_1.auth, hedge_1.createHedge);
router.get("/get-hedges", Auth_1.auth, hedge_1.getHedges);
router.put("/close-hedge/:id", Auth_1.auth, hedge_1.closeHedge);
exports.default = router;
//# sourceMappingURL=hedgeRoutes.js.map