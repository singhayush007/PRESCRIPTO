import mongoose from "mongoose";
import app from "../app.js";
import { config } from "../config/env.js";
import connectDB from "../config/mongodb.js";
import { logger } from "../shared/utils/logger.js";

const onVercel = Boolean(process.env.VERCEL);

connectDB().catch((err) => {
  logger.fatal({ err }, "MongoDB connection failed");
  // a long-running server can't do anything useful without its database; serverless retries on the next request
  if (!onVercel) process.exit(1);
});

// On Vercel the platform handles listening; elsewhere we start the server ourselves
if (!onVercel) {
  const server = app.listen(config.port, () =>
    logger.info({ port: config.port, env: config.env }, "Server started")
  );

  // graceful shutdown: stop accepting requests, finish in-flight ones, close the database
  const shutdown = (signal) => {
    logger.info({ signal }, "Shutting down");
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref(); // force-exit if something hangs
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("unhandledRejection", (err) => logger.error({ err }, "Unhandled promise rejection"));
}

export default app;
