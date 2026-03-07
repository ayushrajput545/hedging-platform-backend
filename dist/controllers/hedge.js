"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeHedge = exports.getHedges = exports.createHedge = void 0;
const Hedge_1 = require("../models/Hedge");
const Farmer_1 = require("../models/Farmer");
const createHedge = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const body = req.body;
        let hedgeData = {
            userId,
            crop: body.crop,
            instrumentType: body.instrumentType,
            positionType: body.positionType, // long = call, short = put
            quantity: body.quantity,
            deliveryDate: new Date(body.deliveryDate),
            profitLoss: 0,
            status: "open",
        };
        // FUTURES LOGIC
        if (body.instrumentType === "futures") {
            hedgeData.entryPrice = body.entryPrice;
            hedgeData.currentPrice = body.entryPrice;
        }
        // OPTIONS LOGIC
        if (body.instrumentType === "options") {
            hedgeData.strikePrice = body.strikePrice;
            hedgeData.premium = body.premium;
            hedgeData.currentPrice = body.strikePrice; // set initial spot to strike for simulation
        }
        const hedge = await Hedge_1.Hedge.create(hedgeData);
        return res.status(201).json({ success: true, message: "Hedge created", hedge });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
exports.createHedge = createHedge;
//get hedges 
const getHedges = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not authenticated",
            });
        }
        const hedges = await Hedge_1.Hedge.find({ userId: userId });
        return res.status(200).json({
            success: true,
            count: hedges.length,
            hedges,
        });
    }
    catch (error) {
        console.error("Error fetching hedges:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hedges",
            error: error.message,
        });
    }
};
exports.getHedges = getHedges;
// Close hedge and update wallet
const closeHedge = async (req, res) => {
    try {
        const hedgeId = req.params.id;
        const farmerId = req.user?.id;
        if (!farmerId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const hedge = await Hedge_1.Hedge.findById(hedgeId);
        if (!hedge) {
            return res.status(404).json({ success: false, message: "Hedge not found" });
        }
        // Safe numeric values for optional fields
        const spot = hedge.currentPrice ?? hedge.entryPrice ?? 0; // Spot = currentPrice always
        const entry = hedge.entryPrice ?? 0;
        const strike = hedge.strikePrice ?? 0;
        const premium = hedge.premium ?? 0;
        let profitLoss = 0;
        // FUTURES P&L
        if (hedge.instrumentType === "futures") {
            profitLoss =
                hedge.positionType === "long"
                    ? (spot - entry) * hedge.quantity
                    : (entry - spot) * hedge.quantity;
        }
        // OPTIONS P&L
        if (hedge.instrumentType === "options") {
            if (hedge.positionType === "long") {
                // CALL Buyer
                profitLoss = (spot - strike - premium) * hedge.quantity;
            }
            else {
                // PUT Buyer
                profitLoss = (strike - spot - premium) * hedge.quantity;
            }
            const maxLoss = premium * hedge.quantity;
            if (profitLoss < 0)
                profitLoss = -maxLoss; // Loss capped to premium
        }
        // Update hedge in database
        const updatedHedge = await Hedge_1.Hedge.findByIdAndUpdate(hedgeId, { status: "closed", profitLoss, closedAt: new Date() }, { new: true });
        // Wallet Update
        await Farmer_1.Farmer.findByIdAndUpdate(farmerId, { $inc: { walletBalance: profitLoss } }, { new: true });
        return res.status(200).json({
            success: true,
            message: "Hedge closed & wallet updated",
            hedge: updatedHedge,
            profitLoss
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to close hedge",
            error: err.message,
        });
    }
};
exports.closeHedge = closeHedge;
//# sourceMappingURL=hedge.js.map