import { Document, Model } from "mongoose";
export interface IContract extends Document {
    crop: "mustard" | "soybean" | "wheat" | "rice" | "other";
    tradeId: string;
    quantity: number;
    agreedPrice: number;
    buyerId?: string;
    deliveryDate: Date;
    status: "draft" | "active" | "completed" | "cancelled";
    blockchainHash?: string | null;
    isAccept?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Contract: Model<IContract>;
//# sourceMappingURL=Contracts.d.ts.map