import { logger } from "./logger.js";

// Shared response helpers for controllers.
// API convention: business errors answer HTTP 200 with { success: false, message };
// authentication problems use 401, rate limiting 429 and unknown routes 404.

export const fail = (res, message) => res.json({ success: false, message });

/** Logs the error with the request id (when available) and answers with a generic message. */
export const serverError = (res, error) => {
  (res.req?.log || logger).error({ err: error }, "request failed");
  res.json({ success: false, message: "Something went wrong, please try again" });
};
