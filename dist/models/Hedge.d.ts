import mongoose, { Document } from "mongoose";
export interface IHedge extends Document {
    userId: mongoose.Types.ObjectId;
    crop: string;
    positionType: "long" | "short";
    instrumentType: "futures" | "options";
    quantity: number;
    entryPrice?: number;
    currentPrice?: number;
    profitLoss?: number;
    status: "open" | "closed";
    deliveryDate: Date;
    strikePrice?: number;
    premium?: number;
    createdAt: Date;
    closedAt?: Date;
}
export declare const Hedge: mongoose.Model<IHedge, {}, {}, {}, mongoose.Document<unknown, {}, IHedge, {}, mongoose.DefaultSchemaOptions> & IHedge & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IHedge>;
//# sourceMappingURL=Hedge.d.ts.map