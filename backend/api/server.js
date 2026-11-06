import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import connectDB from "../config/mongodb.js";
import connectCloudinary from "../config/cloudinary.js";

import userRouter from "../routes/userRoute.js";
import doctorRouter from "../routes/doctorRoute.js";
import adminRouter from "../routes/adminRoute.js";

// Fail fast if critical config is missing
const requiredEnv = ["JWT_SECRET", "MONGODB_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();

connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
connectCloudinary();

// Security headers
app.use(helmet());

// CORS: set CORS_ORIGINS="https://app.example.com,https://admin.example.com" in production
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    allowedHeaders: ["Content-Type", "token", "atoken", "dtoken"],
  })
);

app.use(express.json({ limit: "10kb" }));

// Rate limiting: general API limit + stricter limit on login/register (brute-force protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again later" },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, try again later" },
});

app.use("/api", apiLimiter);
app.use(
  ["/api/user/login", "/api/user/register", "/api/admin/login", "/api/doctor/login"],
  authLimiter
);

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.get("/", (req, res) => res.send("Prescripto API Working"));
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// 404 + central error handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : "Internal server error",
  });
});

// On Vercel the platform handles listening; locally we start the server
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Server started on PORT: ${port}`));
}

export default app;
