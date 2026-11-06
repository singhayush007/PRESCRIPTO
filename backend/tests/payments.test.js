import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { boot, registerUser, createDoctor, book, myAppointments } from "./helpers/app.js";

// Real gateway calls are not possible in tests; these cover the guards around them.
describe("payments (gateways not configured)", () => {
  let ctx, user, appointmentId;
  before(async () => {
    ctx = await boot();
    const doctor = await createDoctor(ctx.models);
    user = await registerUser(ctx.request);
    await book(ctx.request, user.token, doctor._id);
    appointmentId = (await myAppointments(ctx.request, user.token))[0]._id;
  });
  after(() => ctx.stop());

  const post = (path, body, token = user.token) => ctx.request.post(`/api/user/${path}`).set("token", token).send(body);

  test("endpoints require a patient token", async () => {
    for (const path of ["payment-stripe", "verifyStripe", "payment-razorpay", "verifyRazorpay"]) {
      assert.equal((await ctx.request.post(`/api/user/${path}`).send({})).status, 401, path);
    }
  });

  test("starting a payment reports that the gateway is not configured instead of crashing", async () => {
    assert.equal((await post("payment-stripe", { appointmentId })).body.message, "Stripe is not configured");
    assert.equal((await post("payment-razorpay", { appointmentId })).body.message, "Razorpay is not configured");
  });

  test("a client can never mark an appointment as paid by sending success=true", async () => {
    const res = await post("verifyStripe", { appointmentId, success: "true" });
    assert.equal(res.body.success, false);
    assert.equal((await ctx.models.appointment.findById(appointmentId)).payment, false);
  });
});
