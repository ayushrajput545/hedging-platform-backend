import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./config/database";
import cors, { CorsOptions } from "cors";

import authRoutes from "./routes/authRoutes";
import hedgeRoutes from "./routes/hedgeRoutes";
import contractRoutes from "./routes/contractsRoutes";
import farmerRoutes from "./routes/farmerRoutes";
import pinRoutes from "./routes/pinRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

dbConnect();

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://connect-pro-rust.vercel.app",
  "https://connect-pro-9z7w.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Blocked"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hedge", hedgeRoutes);
app.use("/api/v1/contracts", contractRoutes);
app.use("/api/v1/farmer", farmerRoutes);
app.use("/api/v1/pin", pinRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});