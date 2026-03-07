import { Request, Response } from "express";
export declare const createTradeBlockchain: (req: Request, res: Response) => Promise<void>;
export declare const getContracts: (req: Request, res: Response) => Promise<void>;
export declare const getContractById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const acceptTrade: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const completeTrade: (req: Request, res: Response) => Promise<void>;
export declare const getLedger: (req: Request, res: Response) => Promise<void>;
export declare const updateContract: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approveNegotiation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rejectNegotiation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=Contarcts.d.ts.map