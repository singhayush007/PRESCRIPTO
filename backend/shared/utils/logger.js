import pino from "pino";
import { config } from "../../config/env.js";

// JSON logs in production (easy to ship to any log platform), readable logs in development.
export const logger = pino({
  level: config.logLevel,
  // never write credentials to logs
  redact: {
    paths: [
      "req.headers.token",
      "req.headers.atoken",
      "req.headers.dtoken",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[redacted]",
  },
  ...(config.isProd || config.isTest
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "HH:MM:ss", ignore: "pid,hostname" },
        },
      }),
});
