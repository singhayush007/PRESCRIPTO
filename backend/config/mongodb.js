import mongoose from "mongoose";
import { logger } from "../shared/utils/logger.js";

mongoose.set("strictQuery", true);

let connecting = null;

// Connects once and reuses the same promise (important on serverless where the module is
// re-evaluated per cold start but warm instances should not open extra connections).
const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection);
  if (!connecting) {
    mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
    mongoose.connection.on("error", (err) => logger.error({ err }, "MongoDB connection error"));
    mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
    connecting = mongoose
      .connect(`${process.env.MONGODB_URI}/prescripto`, { serverSelectionTimeoutMS: 10000 })
      .catch((err) => {
        connecting = null; // allow a retry on the next call
        throw err;
      });
  }
  return connecting;
};

export default connectDB;
