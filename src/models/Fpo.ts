import mongoose, { Schema, Document } from "mongoose";

export interface IFpo extends Document {
  user: mongoose.Types.ObjectId; // Admin / FPO Owner User ID

  totalMembers: number;
  activeFarmers: number;

  totalContracts: number;
  activeContracts: number;
  completedContracts: number;

  fpoName?: string;
  registrationNumber?: string;
  district?: string;
  state?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const FpoSchema = new Schema<IFpo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    totalMembers: {
      type: Number,
      default: 0,
    },

    activeFarmers: {
      type: Number,
      default: 0,
    },

    totalContracts: {
      type: Number,
      default: 0,
    },

    activeContracts: {
      type: Number,
      default: 0,
    },

    completedContracts: {
      type: Number,
      default: 0,
    },

    // OPTIONAL — Added for real-world completeness
    fpoName: {
      type: String,
    },

    registrationNumber: {
      type: String,
      unique: false,
    },

    district: {
      type: String,
    },

    state: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Fpo = mongoose.model<IFpo>("Fpo", FpoSchema);
