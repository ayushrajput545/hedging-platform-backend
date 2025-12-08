import { Response } from "express";
import { Hedge } from "../models/Hedge";
import { AuthRequest } from "../middleware/Auth";
import { Farmer } from "../models/Farmer";


interface HedgeBody {
  crop: string;
  positionType: string;
  instrumentType: string;
  quantity: number;
  entryPrice?: number;
  premium?:number;
  strikePrice?:number;
  deliveryDate: string;
}


export const createHedge = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const body = req.body as HedgeBody;

    let hedgeData: any = {
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

    const hedge = await Hedge.create(hedgeData);

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

    if (!farmerId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const hedge = await Hedge.findById(hedgeId);

    if (!hedge) {
      return res.status(404).json({ success: false, message: "Hedge not found" });
    }

    // Safe numeric values for optional fields
    const spot: number = hedge.currentPrice ?? hedge.entryPrice ?? 0; // Spot = currentPrice always
    const entry: number = hedge.entryPrice ?? 0;
    const strike: number = hedge.strikePrice ?? 0;
    const premium: number = hedge.premium ?? 0;

    let profitLoss: number = 0;

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
      } else {
        // PUT Buyer
        profitLoss = (strike - spot - premium) * hedge.quantity;
      }

      const maxLoss = premium * hedge.quantity;
      if (profitLoss < 0) profitLoss = -maxLoss; // Loss capped to premium
    }

    // Update hedge in database
    const updatedHedge = await Hedge.findByIdAndUpdate(
      hedgeId,
      { status: "closed", profitLoss, closedAt: new Date() },
      { new: true }
    );

    // Wallet Update
    await Farmer.findByIdAndUpdate(
      farmerId,
      { $inc: { walletBalance: profitLoss } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Hedge closed & wallet updated",
      hedge: updatedHedge,
      profitLoss
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to close hedge",
      error: err.message,
    });
  }
};
