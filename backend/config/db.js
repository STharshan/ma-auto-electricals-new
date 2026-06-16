import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
   
  } catch (err) {
   
    process.exit(1); // Stop server if DB connection fails
  }
};
