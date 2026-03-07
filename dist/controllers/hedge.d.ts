import { Response } from "express";
import { AuthRequest } from "../middleware/Auth";
export declare const createHedge: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getHedges: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const closeHedge: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=hedge.d.ts.map