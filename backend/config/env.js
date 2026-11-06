import "dotenv/config";

// Single place that reads and validates configuration. Everything else imports `config`.
const REQUIRED = ["JWT_SECRET", "MONGODB_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

const num = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const env = process.env.NODE_ENV || "development";

export const config = {
  env,
  isProd: env === "production",
  isTest: env === "test",
  port: num(process.env.PORT, 4000),
  logLevel: process.env.LOG_LEVEL || (env === "test" ? "silent" : "info"),
  // Origins allowed to call the API from a browser. Empty = allow all (development only).
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  // How many reverse proxies sit in front of the app (Vercel, Nginx, a load balancer...).
  // Needed so rate limiting sees the real client IP instead of the proxy's.
  trustProxy:
    process.env.TRUST_PROXY !== undefined
      ? num(process.env.TRUST_PROXY, 0)
      : env === "production"
        ? 1
        : 0,
  rateLimit: {
    max: num(process.env.RATE_LIMIT_MAX, 300),
    authMax: num(process.env.AUTH_RATE_LIMIT_MAX, 20),
    windowMs: 15 * 60 * 1000,
  },
};

/** Throws a readable error if any required variable is missing. */
export function assertEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
