import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { boot, registerUser, createDoctor, loginDoctor, loginAdmin, ADMIN } from "./helpers/app.js";

describe("authentication", () => {
  let ctx;
  before(async () => {
    ctx = await boot();
  });
  after(() => ctx.stop());

  describe("patient registration", () => {
    test("registers, returns a token and never exposes the password", async () => {
      const { request } = ctx;
      const res = await request.post("/api/user/register").send({ name: "Aman", email: "aman@test.com", password: "Password1!" });
      assert.equal(res.body.success, true);
      const profile = await request.get("/api/user/get-profile").set("token", res.body.token);
      assert.equal(profile.body.userData.email, "aman@test.com");
      assert.equal("password" in profile.body.userData, false);
    });

    test("rejects missing details, bad email and short password", async () => {
      const { request } = ctx;
      assert.equal((await request.post("/api/user/register").send({ email: "x@test.com" })).body.message, "Missing Details");
      assert.match((await request.post("/api/user/register").send({ name: "A", email: "nope", password: "Password1!" })).body.message, /valid email/);
      assert.match((await request.post("/api/user/register").send({ name: "A", email: "short@test.com", password: "1234567" })).body.message, /at least 8/);
    });

    test("rejects a duplicate email regardless of letter case", async () => {
      const { request } = ctx;
      await request.post("/api/user/register").send({ name: "A", email: "dup@test.com", password: "Password1!" });
      const res = await request.post("/api/user/register").send({ name: "B", email: "DUP@test.com", password: "Password1!" });
      assert.deepEqual([res.body.success, res.body.message], [false, "Email already registered"]);
    });
  });

  describe("patient login", () => {
    test("logs in (email is case-insensitive)", async () => {
      const { request } = ctx;
      await request.post("/api/user/register").send({ name: "L", email: "login@test.com", password: "Password1!" });
      const res = await request.post("/api/user/login").send({ email: "LOGIN@test.com", password: "Password1!" });
      assert.equal(res.body.success, true);
      assert.ok(res.body.token);
    });

    test("gives the same message for wrong password and unknown email (no account enumeration)", async () => {
      const { request } = ctx;
      await request.post("/api/user/register").send({ name: "E", email: "enum@test.com", password: "Password1!" });
      const wrong = await request.post("/api/user/login").send({ email: "enum@test.com", password: "wrong-password" });
      const unknown = await request.post("/api/user/login").send({ email: "ghost@test.com", password: "Password1!" });
      assert.equal(wrong.body.message, "Invalid credentials");
      assert.equal(unknown.body.message, "Invalid credentials");
    });

    test("blocks NoSQL-injection payloads", async () => {
      const res = await ctx.request.post("/api/user/login").send({ email: { $ne: null }, password: { $ne: null } });
      assert.equal(res.body.success, false);
      assert.equal(res.body.token, undefined);
    });
  });

  describe("tokens", () => {
    test("protected routes answer 401 without, with a garbage, or with an expired token", async () => {
      const { request } = ctx;
      assert.equal((await request.get("/api/user/get-profile")).status, 401);
      assert.equal((await request.get("/api/user/get-profile").set("token", "garbage")).status, 401);
      const expired = jwt.sign({ id: "507f1f77bcf86cd799439011" }, process.env.JWT_SECRET, { expiresIn: -10 });
      assert.equal((await request.get("/api/user/get-profile").set("token", expired)).status, 401);
    });

    test("issued tokens expire", async () => {
      const { token } = await registerUser(ctx.request);
      const { exp, iat } = jwt.decode(token);
      assert.ok(exp > iat, "token should carry an expiry");
    });
  });

  describe("roles", () => {
    test("admin logs in with the configured credentials only", async () => {
      const { request } = ctx;
      assert.equal((await request.post("/api/admin/login").send({ ...ADMIN, password: "nope" })).body.success, false);
      const token = await loginAdmin(request);
      assert.equal(jwt.decode(token).role, "admin"); // role claim, not credentials, is in the token
      assert.equal((await request.get("/api/admin/dashboard").set("atoken", token)).body.success, true);
    });

    test("a patient or doctor token cannot be used as an admin token", async () => {
      const { request, models } = ctx;
      const patient = await registerUser(request);
      const doctor = await createDoctor(models);
      const dtoken = await loginDoctor(request, doctor.email);
      assert.equal((await request.get("/api/admin/dashboard").set("atoken", patient.token)).status, 401);
      assert.equal((await request.get("/api/admin/dashboard").set("atoken", dtoken)).status, 401);
    });

    test("doctor login works and a wrong password is rejected", async () => {
      const { request, models } = ctx;
      const doctor = await createDoctor(models);
      assert.ok(await loginDoctor(request, doctor.email));
      const bad = await request.post("/api/doctor/login").send({ email: doctor.email, password: "bad" });
      assert.equal(bad.body.message, "Invalid credentials");
    });
  });
});
