import mongoose, { Schema, Document } from "mongoose";

export interface ICrop {
  cropName: string;
  cropType:
    | "soybean"
    | "groundnut"
    | "sunflower"
    | "mustard"
    | "sesame"
    | "safflower"
    | "other";
}

export interface IFarmer extends Document {
  user: mongoose.Types.ObjectId;

  totalLandHolding: number;

  crops: ICrop[];


  hedgingExperience: "none" | "beginner" | "intermediate" | "advanced";
  educationLevel: "primary" | "secondary" | "graduate" | "postgraduate";
  digitalLiteracy: "low" | "medium" | "high";

  totalContracts: number;
  activeContracts: number;
  walletBalance: number;

  createdAt?: Date;
  updatedAt?: Date;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    totalLandHolding: {
      type: Number,
      required: true,
    },

    crops: [
      {
        cropName: {
          type: String,
          required: true,
        },
        cropType: {
          type: String,
          required: true,
          enum: ["soybean","groundnut","sunflower","mustard","sesame","safflower","other",],
        },
      },
    ],


    hedgingExperience: {
      type: String,
      enum: ["none", "beginner", "intermediate", "advanced"],
      default: "none",
    },

    educationLevel: {
      type: String,
      enum: ["primary", "secondary", "graduate", "postgraduate"],
      required: true,
    },

    digitalLiteracy: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    totalContracts: {
      type: Number,
      default: 0,
    },

    activeContracts: {
      type: Number,
      default: 0,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Farmer = mongoose.model<IFarmer>("Farmer", FarmerSchema);
