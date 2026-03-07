"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectNegotiation = exports.approveNegotiation = exports.updateContract = exports.getLedger = exports.completeTrade = exports.acceptTrade = exports.getContractById = exports.getContracts = exports.createTradeBlockchain = void 0;
const Contracts_1 = require("../models/Contracts");
const blockchainService_1 = require("../services/blockchainService");
const blockchainService_2 = require("../services/blockchainService");
const createTradeBlockchain = async (req, res) => {
    try {
        const { crop, quantity, agreedPrice, marginAmount } = req.body;
        const deliveryTimestamp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now
        const tx = await blockchainService_1.contract.createTrade(crop, quantity, agreedPrice, deliveryTimestamp, { value: marginAmount });
        const receipt = await tx.wait();
        const event = receipt.logs.find((log) => log.fragment?.name === "TradeCreated");
        const tradeId = event?.args?.id.toString();
        const contractEntry = await Contracts_1.Contract.create({
            tradeId,
            crop,
            quantity,
            agreedPrice,
            deliveryDate: new Date(deliveryTimestamp * 1000),
            status: "draft",
            blockchainHash: receipt.hash,
        });
        res.status(201).json(contractEntry);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
exports.createTradeBlockchain = createTradeBlockchain;
// GET /api/contracts
const getContracts = async (req, res) => {
    try {
        const contracts = await Contracts_1.Contract.find().sort({ createdAt: -1 });
        res.json(contracts);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch contracts", error: err.message });
    }
};
exports.getContracts = getContracts;
// GET /api/contracts/:id -> call this on click view details
const getContractById = async (req, res) => {
    try {
        const contract = await Contracts_1.Contract.findById(req.params.id);
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.json(contract);
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch contract", error: err.message });
    }
};
exports.getContractById = getContractById;
const acceptTrade = async (req, res) => {
    try {
        const mongoId = req.params.id;
        const contractEntry = await Contracts_1.Contract.findById(mongoId);
        if (!contractEntry) {
            return res.status(404).json({ message: "Trade not found" });
        }
        // blockchain trade id
        const tradeId = contractEntry.tradeId;
        // read on-chain trade
        const tradeOnChain = await blockchainService_2.buyerContract.trades(tradeId);
        const marginAmount = tradeOnChain.marginAmount;
        // call acceptTrade
        const tx = await blockchainService_2.buyerContract.acceptTrade(tradeId, {
            value: marginAmount.toString(),
        });
        const receipt = await tx.wait();
        // update DB
        contractEntry.status = "active";
        contractEntry.blockchainHash = receipt.hash;
        contractEntry.buyerId = req.body.buyerId;
        await contractEntry.save();
        res.json({
            message: "Buyer accepted the trade",
            txHash: receipt.hash,
            tradeId
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Trade accept failed",
            error: err.message,
        });
    }
};
exports.acceptTrade = acceptTrade;
const completeTrade = async (req, res) => {
    try {
        const tradeId = req.params.id;
        const tx = await blockchainService_1.contract.completeTrade(tradeId);
        const receipt = await tx.wait();
        await Contracts_1.Contract.findByIdAndUpdate(tradeId, { status: "completed", blockchainHash: receipt.hash });
        res.json({ message: "Trade completed", txHash: receipt.hash });
    }
    catch (err) {
        res.status(500).json({ message: "Trade completion failed", error: err.message });
    }
};
exports.completeTrade = completeTrade;
const getLedger = async (req, res) => {
    try {
        const filter = blockchainService_1.contract.filters.TradeCreated();
        const logs = await blockchainService_1.contract.queryFilter(filter);
        res.json(logs.map((log) => ({
            event: log.eventName,
            id: log.args?.id.toString(),
            commodity: log.args?.commodity,
            margin: log.args?.margin?.toString(),
            txHash: log.transactionHash,
        })));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getLedger = getLedger;
// put /api/contracts/:id
const updateContract = async (req, res) => {
    try {
        const updates = req.body; // contains negotiatedAmt or other values
        const contract = await Contracts_1.Contract.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!contract) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.json(contract);
    }
    catch (err) {
        res.status(400).json({ message: "Failed to update contract", error: err.message });
    }
};
exports.updateContract = updateContract;
const approveNegotiation = async (req, res) => {
    try {
        const contract = await Contracts_1.Contract.findByIdAndUpdate(req.params.id, {
            isNegotiated: true,
            agreedPrice: req.body.negotiatedAmt, // update agreed price permanently
        }, { new: true });
        if (!contract)
            return res.status(404).json({ message: "Contract not found" });
        res.json(contract);
    }
    catch (err) {
        res.status(400).json({ message: "Approval failed", error: err.message });
    }
};
exports.approveNegotiation = approveNegotiation;
const rejectNegotiation = async (req, res) => {
    try {
        const contract = await Contracts_1.Contract.findByIdAndUpdate(req.params.id, {
            isNegotiated: false,
            negotiatedAmt: null,
        }, { new: true });
        if (!contract)
            return res.status(404).json({ message: "Contract not found" });
        res.json(contract);
    }
    catch (err) {
        res.status(400).json({ message: "Rejection failed", error: err.message });
    }
};
exports.rejectNegotiation = rejectNegotiation;
// DELETE /api/contracts/:id
// export const deleteContract = async (req: Request, res: Response) => {
//   try {
//     const contract = await Contract.findByIdAndDelete(req.params.id);
//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }
//     res.json({ message: "Contract deleted successfully" });
//   } catch (err: any) {
//     res.status(500).json({ message: "Failed to delete contract", error: err.message });
//   }
// };
//# sourceMappingURL=Contarcts.js.map