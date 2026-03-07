"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyerContract = exports.buyerWallet = exports.contract = void 0;
const ethers_1 = require("ethers");
const abi = require("../abi.json");
const blockchainConfig_1 = require("../config/blockchainConfig");
const provider = new ethers_1.ethers.JsonRpcProvider(blockchainConfig_1.BlockChianCONFIG.RPC_URL);
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
exports.contract = new ethers_1.ethers.Contract(blockchainConfig_1.BlockChianCONFIG.CONTRACT_ADDRESS, abi, wallet);
// BUYER WALLET
exports.buyerWallet = new ethers_1.ethers.Wallet(process.env.BUYER_PRIVATE_KEY, provider);
exports.buyerContract = new ethers_1.ethers.Contract(blockchainConfig_1.BlockChianCONFIG.CONTRACT_ADDRESS, abi, exports.buyerWallet);
//# sourceMappingURL=blockchainService.js.map