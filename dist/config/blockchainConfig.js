"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockChianCONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BlockChianCONFIG = {
    PORT: process.env.PORT || 3000,
    RPC_URL: process.env.RPC_URL, // Default public RPC
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || '0xeE60291E93dA9A242312237BF876052609ee11DE',
};
//# sourceMappingURL=blockchainConfig.js.map