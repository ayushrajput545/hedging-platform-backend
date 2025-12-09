import mongoose, { Document, Schema, Model } from "mongoose";

export interface IContract extends Document {
  crop: "mustard" | "soybean" | "wheat" | "rice" | "other";
  tradeId:string
  quantity: number;
  agreedPrice: number;
  buyerId?: string;
  deliveryDate: Date;
  status: "draft" | "active" | "completed" | "cancelled";
  blockchainHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const contractSchema: Schema<IContract> = new Schema(
  {
    crop: {
      type: String,
      required: true,
      enum: ["mustard", "soybean", "wheat", "rice", "other"],
    },
    tradeId: {
  type: String,
  required: true,
  unique: true,
},

    quantity: {
      type: Number,
      required: true,
    },
    agreedPrice: {
      type: Number,
      required: true,
    },
    buyerId: {
      type: String,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "cancelled"],
      default: "draft",
    },
    blockchainHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Contract: Model<IContract> =
  mongoose.models.Contract || mongoose.model<IContract>("Contract", contractSchema);
