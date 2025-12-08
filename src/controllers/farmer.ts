import { Request, Response } from "express";
import { AuthRequest } from "../middleware/Auth";
import { Farmer } from "../models/Farmer";

export const getFarmerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // from auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found",
      });
    }

    const farmer = await Farmer.findOne({ user: userId }).populate("user");
    
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

  } catch (error: any) {
    console.error("Get Farmer Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};