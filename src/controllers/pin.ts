import { Request, Response } from "express";
import User from "../models/User"; 
import { Contract } from "../models/Contracts";

// ---------------------------------------------------------
// 1. FPO View: Get nearby Farmer requests (Pending FPO)
// ---------------------------------------------------------
export const getRequestsForFPO = async (req: Request, res: Response) => {
  try {
    const { fpoId } = req.params;

    // 1. Find the FPO User to get their Pincode
    const fpoUser = await User.findById(fpoId);
    if (!fpoUser) {
      return res.status(404).json({ msg: "FPO User not found" });
    }

    // Access nested pincode from User model
    const fpoPincode = fpoUser.addressDetail.pincode;

    // 2. Find Contracts:
    //    - Matching Pincode
    //    - Status is "pending-fpo" (Farmer created, FPO hasn't seen yet)
    const requests = await Contract.find({
      pincode: fpoPincode,
      status: "pending-fpo",
    })
    .populate("farmerId", "firstName lastName phoneNumber addressDetail") // Show farmer details
    .sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ---------------------------------------------------------
// 2. FPO Action: Approve Request (Moves to Buyer Queue)
// ---------------------------------------------------------
export const approveRequestByFPO = async (req: Request, res: Response) => {
  try {
    const { contractId, fpoId } = req.body;

    // 1. Update the contract
    const updatedContract = await Contract.findByIdAndUpdate(
      contractId,
      { 
        fpoId: fpoId,            // Assign this FPO to the contract
        status: "pending-buyer",
        isAccept: true  // Move status forward
      },
      { new: true }
    );

    if (!updatedContract) {
      return res.status(404).json({ msg: "Contract not found" });
    }

    res.json({ msg: "Approved and sent to nearby Buyers", contract: updatedContract });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ---------------------------------------------------------
// 3. Buyer View: Get nearby FPO-Approved requests
// ---------------------------------------------------------
export const getRequestsForBuyer = async (req: Request, res: Response) => {
  try {
    const { buyerId } = req.params;

    // 1. Find the Buyer User to get their Pincode
    const buyerUser = await User.findById(buyerId);
    if (!buyerUser) {
      return res.status(404).json({ msg: "Buyer User not found" });
    }

    const buyerPincode = buyerUser.addressDetail.pincode;

    // 2. Find Contracts:
    //    - Matching Pincode
    //    - Status is "pending-buyer" (Approved by FPO, waiting for Buyer)
    const requests = await Contract.find({
      pincode: buyerPincode,
      status: "pending-buyer",
    })
    .populate("farmerId", "firstName lastName") // Show Basic Farmer Info
    .populate("fpoId", "firstName lastName phoneNumber"); // Show FPO Info

    res.json(requests);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};