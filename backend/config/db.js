import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
   
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Stop server if DB connection fails
  }
};
