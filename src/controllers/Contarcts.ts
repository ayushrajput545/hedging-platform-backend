import { Contract, IContract } from "../models/Contracts";
import { Request, Response } from "express";
import { contract } from "../services/blockchainService";
import mongoose from "mongoose";

export const createTradeBlockchain = async (req: Request, res: Response) => {
  try {
    const { crop, quantity, agreedPrice, marginAmount } = req.body;

    const deliveryTimestamp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now

    const tx = await contract.createTrade(
      crop,
      quantity,
      agreedPrice,
      deliveryTimestamp,
      { value: marginAmount }
    );

    const receipt = await tx.wait();

    const event = receipt.logs.find((log: any) => log.fragment?.name === "TradeCreated");
    const tradeId = event?.args?.id.toString();

    const contractEntry = await Contract.create({
      tradeId,
      crop,
      quantity,
      agreedPrice,
      deliveryDate: new Date(deliveryTimestamp * 1000),
      status: "draft",
      blockchainHash: receipt.hash,
    });

    res.status(201).json(contractEntry);

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// GET /api/contracts
export const getContracts = async (req: Request, res: Response) => {
  try {
    const contracts: IContract[] = await Contract.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch contracts", error: err.message });
  }
};

// GET /api/contracts/:id -> call this on click view details
export const getContractById = async (req: Request, res: Response) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.json(contract);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch contract", error: err.message });
  }
};


export const acceptTrade = async (req: Request, res: Response) => {
  try {
    const mongoId = req.params.id; // this is MongoDB ObjectId, not blockchain tradeId

    // Find contract entry in DB
    const contractEntry = await Contract.findById(mongoId);
    if (!contractEntry) {
      return res.status(404).json({ message: "Trade not found" });
    }

    // Extract tradeId stored in DB (blockchain trade id)
    const tradeId = contractEntry.tradeId;

    // Read margin from blockchain trade struct
    const tradeOnChain = await contract.trades(tradeId);
    const marginAmount = tradeOnChain.marginAmount;

    // Call blockchain transaction
    const tx = await contract.acceptTrade(tradeId, {
      value: marginAmount.toString(), // margin must be in wei
    });
    const receipt = await tx.wait();

    // Update DB
    contractEntry.status = "active";
    contractEntry.blockchainHash = receipt.hash;
    contractEntry.buyerId = req.body.buyerId; // optional
    await contractEntry.save();

    res.json({
      message: "Trade accepted successfully",
      txHash: receipt.hash,
      tradeId,
    });

  } catch (err: any) {
    res.status(500).json({
      message: "Trade accept failed",
      error: err.message,
    });
  }
};

export const completeTrade = async (req: Request, res: Response) => {
  try {
    const tradeId = req.params.id;

    const tx = await contract.completeTrade(tradeId);
    const receipt = await tx.wait();

    await Contract.findByIdAndUpdate(tradeId, { status: "completed", blockchainHash: receipt.hash });

    res.json({ message: "Trade completed", txHash: receipt.hash });
  } catch (err: any) {
    res.status(500).json({ message: "Trade completion failed", error: err.message });
  }
};

export const getLedger = async (req: Request, res: Response) => {
  try {
    const filter = contract.filters.TradeCreated();
    const logs = await contract.queryFilter(filter);

    res.json(
      logs.map((log:any) => ({
        event: log.eventName,
        id: log.args?.id.toString(),
        commodity: log.args?.commodity,
        margin: log.args?.margin?.toString(),
        txHash: log.transactionHash,
      }))
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



// put /api/contracts/:id
// export const updateContract = async (req: Request, res: Response) => {
//   try {
//     const updates = req.body;
//     const contract = await Contract.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     res.json(contract);
//   } catch (err: any) {
//     res.status(400).json({ message: "Failed to update contract", error: err.message });
//   }
// };

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

