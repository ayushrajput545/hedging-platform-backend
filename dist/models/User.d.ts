import mongoose, { Document } from "mongoose";
export interface IAddress {
    line1: string;
    line2?: string;
    state: string;
    district: string;
    pincode: number;
}
export interface IUser extends Document {
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
export default _default;
//# sourceMappingURL=User.d.ts.map