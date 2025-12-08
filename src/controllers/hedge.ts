import { Response } from "express";
import { Hedge } from "../models/Hedge";
import { AuthRequest } from "../middleware/Auth";
import { Farmer } from "../models/Farmer";


interface HedgeBody {
  crop: string;
  positionType: string;
  instrumentType: string;
  quantity: number;
  entryPrice: number;
}


export const createHedge = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const body = req.body as HedgeBody;  // Type assertion to avoid undefined/null error

    const hedge = await Hedge.create({
      userId,
      crop: body.crop,
      positionType: body.positionType,
      instrumentType: body.instrumentType,
      quantity: body.quantity,
      entryPrice: body.entryPrice,
      currentPrice: body.entryPrice,
      profitLoss: 0,
    });

    return res.status(201).json({ success: true, message: "Hedge created", hedge });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

//get hedges 
export const getHedges = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      });
    }

    const hedges = await Hedge.find({ userId: userId });

    return res.status(200).json({
      success: true,
      count: hedges.length,
      hedges,
    });

  } catch (error: any) {
    console.error("Error fetching hedges:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hedges",
      error: error.message,
    });
  }
};


// Close hedge and update wallet
export const closeHedge = async (req: AuthRequest, res: Response) => {
  try {
    const hedgeId = req.params.id;
    const farmerId = req.user?.id;

    // Find existing hedge
    const hedge = await Hedge.findById(hedgeId);
    if (!hedge) {
      return res.status(404).json({ success: false, message: "Hedge not found" });
    }

const current = hedge.currentPrice ?? hedge.entryPrice;

const profitLoss =
  hedge.positionType === "long"
    ? (current - hedge.entryPrice) * hedge.quantity
    : (hedge.entryPrice - current) * hedge.quantity;


    // Update hedge status and lock profit
    const updatedHedge = await Hedge.findByIdAndUpdate(
      hedgeId,
      { status: "closed", profitLoss, closedAt: new Date() },
      { new: true }
    );

    // Update wallet
    await Farmer.findByIdAndUpdate(
      farmerId,
      { $inc: { walletBalance: profitLoss } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Hedge closed & wallet updated",
      hedge: updatedHedge,
      profitLoss,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to close hedge",
      error: err.message,
    });
  }
};
