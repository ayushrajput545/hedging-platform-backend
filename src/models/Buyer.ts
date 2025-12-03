import mongoose, { Schema, Document } from "mongoose";

export interface IBuyer extends Document {
  user: mongoose.Types.ObjectId;      // Buyer login reference (User table)

  organizationName: string;           // Company / Buyer Name
  organizationType: "company" | "exporter" | "processor" | "broker" | "other";

  gstNumber?: string;                 // Optional GST for Indian companies
  contactPerson?: string;             // Representative name
  contactEmail?: string;
  contactPhone?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;

  totalPurchases: number;             // Total deals (contracts)
  activeContracts: number;            // Ongoing deals
  completedContracts: number;         // Finished deals

  createdAt?: Date;
  updatedAt?: Date;
}

const BuyerSchema = new Schema<IBuyer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   // one user = one buyer profile
    },

    organizationName: {
      type: String,
      required: true,
    },

    organizationType: {
      type: String,
      enum: ["company", "exporter", "processor", "broker", "other"],
      required: true,
      default: "company",
    },

    gstNumber: {
      type: String,
    },

    contactPerson: {
      type: String,
    },

    contactEmail: {
      type: String,
    },

    contactPhone: {
      type: String,
    },

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    state: {
      type: String,
    },

    country: {
      type: String,
      default: "India",
    },

    totalPurchases: {
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
  },
  { timestamps: true }
);

export const Buyer = mongoose.model<IBuyer>("Buyer", BuyerSchema);
