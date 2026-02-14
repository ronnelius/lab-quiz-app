import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected to", mongoose.connection.name);
  } catch (error) {
    console.error("DB connection failed:", error.message);
  }
};
