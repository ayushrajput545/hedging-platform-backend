"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const hedgeRoutes_1 = __importDefault(require("./routes/hedgeRoutes"));
const contractsRoutes_1 = __importDefault(require("./routes/contractsRoutes"));
const farmerRoutes_1 = __importDefault(require("./routes/farmerRoutes"));
const pinRoutes_1 = __importDefault(require("./routes/pinRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, database_1.dbConnect)();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://hedging-frontened.vercel.app"
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS Blocked"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.options(/.*/, (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/hedge", hedgeRoutes_1.default);
app.use("/api/v1/contracts", contractsRoutes_1.default);
app.use("/api/v1/farmer", farmerRoutes_1.default);
app.use("/api/v1/pin", pinRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map