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
    const { profitLoss } = req.body;
    const farmerId = req.user?.id;

    const hedge = await Hedge.findByIdAndUpdate(
      req.params.id,
      { status: "closed", profitLoss, closedAt: new Date() },
      { new: true }
    );

    await Farmer.findByIdAndUpdate(
      farmerId,
      { $inc: { walletBalance: profitLoss } }, // add or subtract
      { new: true }
    );

    res.json({ message: "Hedge closed & wallet updated", hedge });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
