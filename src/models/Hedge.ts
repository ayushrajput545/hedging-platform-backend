import mongoose, { Document, Mongoose, Schema } from "mongoose";

export interface IHedge extends Document{
    userId:mongoose.Types.ObjectId;
    crop:string;
    positionType:"long"|"short";
    instrumentType: "futures" | "options";
    quantity: number;
    entryPrice?: number;
    currentPrice?: number;
    profitLoss?: number;
    status: "open" | "closed";
    deliveryDate: Date; 
    strikePrice?:number;
    premium?:number
    createdAt: Date;
    closedAt?: Date;
}

const hedgeSchema = new Schema<IHedge>({
    userId:{ type: Schema.Types.ObjectId, ref: "Farmer", required: true },
    crop: {
      type: String,
      required: true,
    },
    deliveryDate: {
  type: Date,
  required: true,
},

    positionType: {
      type: String,
      enum: ["long", "short"],
      required: true,
    },
    instrumentType: {
      type: String,
      enum: ["futures", "options"],
      required: true,
    },
    quantity: { type: Number, required: true },
    entryPrice: { type: Number},
    currentPrice: { type: Number, default: 0 },
    profitLoss: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    strikePrice: { type: Number },
premium: { type: Number },
    createdAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
},  { timestamps: true })

export const Hedge = mongoose.model<IHedge>("Hedge", hedgeSchema);