import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  phoneNumber: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  phoneNumber: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // 5 minutes
  },
});

const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);

export default OtpModel;
