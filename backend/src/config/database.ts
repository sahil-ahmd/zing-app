import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI as string;
    if (!mongoUri) {
      throw new Error("MONGODB_URI env variable is not defined.");
    }
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully!!!");
  } catch (error) {
    console.log("❌ MongoDB connection error: ", error);
    process.exit(1); // exit with failure
    // status code 1 -> failure
    // status code 0 -> success
  }
};
