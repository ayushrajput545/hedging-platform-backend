import mongoose, { Document } from "mongoose";
export interface IFarmer extends Document {
    user: mongoose.Types.ObjectId;
    totalLandHolding: number;
    crops: {
        cropType: string;
    }[];
    hedgingExperience: "none" | "beginner" | "intermediate" | "advanced";
    educationLevel: "primary" | "secondary" | "graduate" | "postgraduate";
    digitalLiteracy: "low" | "medium" | "high";
    totalContracts: number;
    activeContracts: number;
    walletBalance: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Farmer: mongoose.Model<IFarmer, {}, {}, {}, mongoose.Document<unknown, {}, IFarmer, {}, mongoose.DefaultSchemaOptions> & IFarmer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IFarmer>;
//# sourceMappingURL=Farmer.d.ts.map