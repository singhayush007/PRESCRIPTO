import crypto from "crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import mongoose from "mongoose";

import { assertEnv, config } from "./config/env.js";
import { logger } from "./shared/utils/logger.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./features/users/user.routes.js";
import doctorRouter from "./features/doctors/doctor.routes.js";
import adminRouter from "./features/admin/admin.routes.js";

// Fail fast (with a clear message) if the app is misconfigured
assertEnv();
connectCloudinary();

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);

// Structured request logging with a request id (also returned to the client as x-request-id)
app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const id = req.headers["x-request-id"] || crypto.randomUUID();
      res.setHeader("x-request-id", id);
      return id;
    },
    autoLogging: { ignore: (req) => req.url === "/health" || req.url === "/ready" },
    customLogLevel: (req, res, err) =>
      err || res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
  })
);

app.use(helmet());

if (config.isProd && config.corsOrigins.length === 0) {
  logger.warn(
    "CORS_ORIGINS is not set: the API accepts requests from any origin. Set it in production."
  );
}
app.use(
  cors({
    origin: config.corsOrigins.length ? config.corsOrigins : true,
    allowedHeaders: ["Content-Type", "token", "atoken", "dtoken"],
    exposedHeaders: ["x-request-id"],
  })
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));

// Rate limiting: general API limit + a stricter limit on login/register (brute-force protection)
const limiter = (max, message) =>
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
  });
app.use("/api", limiter(config.rateLimit.max, "Too many requests, try again later"));
app.use(
  ["/api/user/login", "/api/user/register", "/api/admin/login", "/api/doctor/login"],
  limiter(config.rateLimit.authMax, "Too many attempts, try again later")
);

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.get("/", (req, res) => res.send("Prescripto API Working"));
// liveness: the process is up
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));
// readiness: the app can serve traffic (database connected)
app.get("/ready", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "unavailable" });
});

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body too large" });
  }
  (req.log || logger).error({ err }, "unhandled error");
  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : "Internal server error",
  });
});

export default app;
