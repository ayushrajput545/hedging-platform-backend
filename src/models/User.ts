import mongoose, { Document, Schema } from "mongoose";

export interface IAddress {
  line1: string;
  line2?: string;
  state: string;
  district: string;
  pincode:number
}

export interface IUser extends Document{
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  role: "farmer" | "fpo" | "buyer" | "admin";
  profileImage?: string;
  addressDetail: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String },

    role: {
      type: String,
      enum: ["farmer", "fpo", "buyer", "admin"],
      required: true,
    },

    profileImage: { type: String },

    // INLINE Address Schema
    addressDetail: {
      line1: { type: String, required: true },
      line2: { type: String },
      state: { type: String, required: true },
      district: { type: String, required: true },
      pincode:{type:Number, required:true}
    },
}, {timestamps:true})

export default mongoose.model<IUser>("User", userSchema);