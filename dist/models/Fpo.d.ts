import mongoose, { Document } from "mongoose";
export interface IFpo extends Document {
    user: mongoose.Types.ObjectId;
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
export declare const Fpo: mongoose.Model<IFpo, {}, {}, {}, mongoose.Document<unknown, {}, IFpo, {}, mongoose.DefaultSchemaOptions> & IFpo & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IFpo>;
//# sourceMappingURL=Fpo.d.ts.map