"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmerProfile = void 0;
const Farmer_1 = require("../models/Farmer");
const getFarmerProfile = async (req, res) => {
    try {
        const userId = req.user?.id; // from auth middleware
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No user ID found",
            });
        }
        const farmer = await Farmer_1.Farmer.findOne({ user: userId }).populate("user");
        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer profile not found",
            });
        }
        return res.status(200).json({
            success: true,
            farmer,
        });
    }
    catch (error) {
        console.error("Get Farmer Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.getFarmerProfile = getFarmerProfile;
//# sourceMappingURL=farmer.js.map