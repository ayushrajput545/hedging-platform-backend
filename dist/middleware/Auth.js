"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token ||
            req.body?.token ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ success: false, message: "Token Missing" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
        catch (err) {
            return res.status(401).json({ success: false, message: "Token is Invalid" });
        }
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};
exports.auth = auth;
//# sourceMappingURL=Auth.js.map