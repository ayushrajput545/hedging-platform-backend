"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerContract = exports.buyerWallet = exports.contract = void 0;
const ethers_1 = require("ethers");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const blockchainConfig_1 = require("../config/blockchainConfig");
const abiPath = path_1.default.join(__dirname, "..", "..", "src", "abi.json");
const abi = JSON.parse(fs_1.default.readFileSync(abiPath, "utf8"));
const provider = new ethers_1.ethers.JsonRpcProvider(blockchainConfig_1.BlockChianCONFIG.RPC_URL);
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
exports.contract = new ethers_1.ethers.Contract(blockchainConfig_1.BlockChianCONFIG.CONTRACT_ADDRESS, abi, wallet);
// BUYER WALLET
exports.buyerWallet = new ethers_1.ethers.Wallet(process.env.BUYER_PRIVATE_KEY, provider);
exports.buyerContract = new ethers_1.ethers.Contract(blockchainConfig_1.BlockChianCONFIG.CONTRACT_ADDRESS, abi, exports.buyerWallet);
//# sourceMappingURL=blockchainService.js.map