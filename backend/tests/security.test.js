import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { boot } from "./helpers/app.js";

describe("platform security and operations", () => {
  let ctx;
  before(async () => {
    ctx = await boot({ AUTH_RATE_LIMIT_MAX: "4" }); // strict auth limit for this file only
  });
  after(() => ctx.stop());

  test("login attempts are rate limited (429 with a friendly message)", async () => {
    const { request } = ctx;
    const attempt = () =>
      request.post("/api/user/login").send({ email: "x@test.com", password: "wrong-pass" });
    for (let i = 0; i < 4; i++) assert.equal((await attempt()).status, 200);
    const blocked = await attempt();
    assert.equal(blocked.status, 429);
    assert.match(blocked.body.message, /Too many attempts/);
    // the limit is shared by every auth route
    assert.equal(
      (await request.post("/api/admin/login").send({ email: "a", password: "b" })).status,
      429
    );
  });

  test("sends security headers, hides the framework and tags every response with a request id", async () => {
    const res = await ctx.request.get("/health");
    assert.equal(res.headers["x-content-type-options"], "nosniff");
    assert.ok(res.headers["strict-transport-security"]);
    assert.equal(res.headers["x-powered-by"], undefined);
    assert.ok(res.headers["x-request-id"]);
    const echoed = await ctx.request.get("/health").set("x-request-id", "abc-123");
    assert.equal(echoed.headers["x-request-id"], "abc-123");
  });

  test("health and readiness endpoints", async () => {
    assert.equal((await ctx.request.get("/health")).body.status, "ok");
    const ready = await ctx.request.get("/ready");
    assert.deepEqual([ready.status, ready.body.status], [200, "ready"]);
  });

  test("unknown routes and malformed or oversized bodies return clean JSON errors", async () => {
    const { request } = ctx;
    const missing = await request.get("/api/nope");
    assert.deepEqual([missing.status, missing.body.success], [404, false]);
    const broken = await request
      .post("/api/doctor/login")
      .set("Content-Type", "application/json")
      .send("{not json");
    assert.deepEqual([broken.status, broken.body.message], [400, "Invalid JSON body"]);
    const huge = await request.post("/api/doctor/login").send({ email: "x".repeat(20000) });
    assert.equal(huge.status, 413);
  });

  test("CORS allows the custom auth headers", async () => {
    const res = await ctx.request
      .options("/api/user/login")
      .set("Origin", "https://example.com")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "token");
    assert.match(res.headers["access-control-allow-headers"], /token/i);
  });

  test("uploads: anonymous requests are rejected before any file is read; non-images get 400", async () => {
    const { request } = ctx;
    const anon = await request
      .post("/api/user/update-profile")
      .attach("image", Buffer.from("x"), { filename: "a.png", contentType: "image/png" });
    assert.equal(anon.status, 401);
    // register uses an auth route that is already rate limited above, so create the user directly
    const jwt = (await import("jsonwebtoken")).default;
    const user = await ctx.models.user.create({ name: "U", email: "up@test.com", password: "x" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const text = await request
      .post("/api/user/update-profile")
      .set("token", token)
      .field("name", "n")
      .attach("image", Buffer.from("hi"), { filename: "a.txt", contentType: "text/plain" });
    assert.equal(text.status, 400);
  });
});
