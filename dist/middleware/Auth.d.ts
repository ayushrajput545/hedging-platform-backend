import { Request, Response, NextFunction } from "express";
interface DecodedToken {
    id: string;
    phoneNumber: string;
    role: string;
}
export interface AuthRequest extends Request {
    user?: DecodedToken;
}
export declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=Auth.d.ts.map