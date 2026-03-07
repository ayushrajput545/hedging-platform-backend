"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestsForBuyer = exports.approveRequestByFPO = exports.getRequestsForFPO = void 0;
const User_1 = __importDefault(require("../models/User"));
const Contracts_1 = require("../models/Contracts");
// ---------------------------------------------------------
// 1. FPO View: Get nearby Farmer requests (Pending FPO)
// ---------------------------------------------------------
const getRequestsForFPO = async (req, res) => {
    try {
        const { fpoId } = req.params;
        // 1. Find the FPO User to get their Pincode
        const fpoUser = await User_1.default.findById(fpoId);
        if (!fpoUser) {
            return res.status(404).json({ msg: "FPO User not found" });
        }
        // Access nested pincode from User model
        const fpoPincode = fpoUser.addressDetail.pincode;
        // 2. Find Contracts:
        //    - Matching Pincode
        //    - Status is "pending-fpo" (Farmer created, FPO hasn't seen yet)
        const requests = await Contracts_1.Contract.find({
            pincode: fpoPincode,
            status: "pending-fpo",
        })
            .populate("farmerId", "firstName lastName phoneNumber addressDetail") // Show farmer details
            .sort({ createdAt: -1 });
        res.json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
};
exports.getRequestsForFPO = getRequestsForFPO;
// ---------------------------------------------------------
// 2. FPO Action: Approve Request (Moves to Buyer Queue)
// ---------------------------------------------------------
const approveRequestByFPO = async (req, res) => {
    try {
        const { contractId, fpoId } = req.body;
        // 1. Update the contract
        const updatedContract = await Contracts_1.Contract.findByIdAndUpdate(contractId, {
            fpoId: fpoId, // Assign this FPO to the contract
            status: "pending-buyer",
            isAccept: true // Move status forward
        }, { new: true });
        if (!updatedContract) {
            return res.status(404).json({ msg: "Contract not found" });
        }
        res.json({ msg: "Approved and sent to nearby Buyers", contract: updatedContract });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
};
exports.approveRequestByFPO = approveRequestByFPO;
// ---------------------------------------------------------
// 3. Buyer View: Get nearby FPO-Approved requests
// ---------------------------------------------------------
const getRequestsForBuyer = async (req, res) => {
    try {
        const { buyerId } = req.params;
        // 1. Find the Buyer User to get their Pincode
        const buyerUser = await User_1.default.findById(buyerId);
        if (!buyerUser) {
            return res.status(404).json({ msg: "Buyer User not found" });
        }
        const buyerPincode = buyerUser.addressDetail.pincode;
        // 2. Find Contracts:
        //    - Matching Pincode
        //    - Status is "pending-buyer" (Approved by FPO, waiting for Buyer)
        const requests = await Contracts_1.Contract.find({
            pincode: buyerPincode,
            status: "pending-buyer",
        })
            .populate("farmerId", "firstName lastName") // Show Basic Farmer Info
            .populate("fpoId", "firstName lastName phoneNumber"); // Show FPO Info
        res.json(requests);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server Error" });
    }
};
exports.getRequestsForBuyer = getRequestsForBuyer;
//# sourceMappingURL=pin.js.map