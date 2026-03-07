import mongoose, { Document } from "mongoose";
export interface IBuyer extends Document {
    user: mongoose.Types.ObjectId;
    organizationName: string;
    organizationType: "company" | "exporter" | "processor" | "broker" | "other";
    gstNumber?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    totalPurchases: number;
    activeContracts: number;
    completedContracts: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Buyer: mongoose.Model<IBuyer, {}, {}, {}, mongoose.Document<unknown, {}, IBuyer, {}, mongoose.DefaultSchemaOptions> & IBuyer & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IBuyer>;
//# sourceMappingURL=Buyer.d.ts.map