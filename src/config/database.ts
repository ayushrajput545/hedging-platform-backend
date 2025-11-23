import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = async (): Promise<void> => {
    try {
        const mongoURI = process.env.DATABASE_URL;

        if (!mongoURI) {
            throw new Error("DATABASE_URL is not defined in environment variables");
        }

        await mongoose.connect(mongoURI);

        console.log("DB CONNECTION SUCCESSFUL");
    } catch (error) {
        console.error("Failed to connect DB:", error);
    }
};
