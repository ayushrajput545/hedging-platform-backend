import { Contract, IContract } from "../models/Contracts";
import { Request, Response } from "express";

// POST /api/contracts
export const createContract = async (req: Request, res: Response) => {
  try {
    const {
      crop,
      quantity,
      agreedPrice,
      buyerId,
      deliveryDate,
      status,
      blockchainHash,
    } = req.body;

    const contract: IContract = await Contract.create({
    crop,
    quantity,
    agreedPrice,
    buyerId,
    deliveryDate,
    status: status || "draft",
    blockchainHash: blockchainHash || null,
    });


    res.status(201).json(contract);
  } catch (err: any) {
    res.status(400).json({ message: "Failed to create contract", error: err.message });
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