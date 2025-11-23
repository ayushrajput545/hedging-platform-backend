"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConnect = async () => {
    try {
        const mongoURI = process.env.DATABASE_URL;
        if (!mongoURI) {
            throw new Error("DATABASE_URL is not defined in environment variables");
        }
        await mongoose_1.default.connect(mongoURI);
        console.log("DB CONNECTION SUCCESSFUL");
    }
    catch (error) {
        console.error("Failed to connect DB:", error);
    }
};
exports.dbConnect = dbConnect;
//# sourceMappingURL=database.js.map