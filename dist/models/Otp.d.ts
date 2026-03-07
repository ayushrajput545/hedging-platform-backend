import mongoose, { Document } from "mongoose";
export interface IOtp extends Document {
    phoneNumber: string;
    otp: string;
    createdAt: Date;
}
declare const OtpModel: mongoose.Model<IOtp, {}, {}, {}, mongoose.Document<unknown, {}, IOtp, {}, mongoose.DefaultSchemaOptions> & IOtp & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IOtp>;
export default OtpModel;
//# sourceMappingURL=Otp.d.ts.map