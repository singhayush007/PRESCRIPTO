import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { boot, registerUser, createDoctor, book, myAppointments } from "./helpers/app.js";

describe("ratings and reviews", () => {
  let ctx, doctor;
  before(async () => {
    ctx = await boot();
    doctor = await createDoctor(ctx.models);
  });
  after(() => ctx.stop());

  const review = (token, appointmentId, body) =>
    ctx.request.post("/api/user/add-review").set("token", token).send({ appointmentId, ...body });

  async function completedVisit(slotTime) {
    const user = await registerUser(ctx.request, "Reviewer " + slotTime);
    await book(ctx.request, user.token, doctor._id, "7_11_2026", slotTime);
    const [appt] = await myAppointments(ctx.request, user.token);
    await ctx.models.appointment.updateOne({ _id: appt._id }, { isCompleted: true });
    return { user, appt };
  }

  test("only completed appointments can be reviewed", async () => {
    const user = await registerUser(ctx.request);
    await book(ctx.request, user.token, doctor._id, "7_11_2026", "09:00 AM");
    const [appt] = await myAppointments(ctx.request, user.token);
    const res = await review(user.token, appt._id, { rating: 5 });
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /completed/);
  });

  test("validates the rating (1-5, integer, not an object)", async () => {
    const { user, appt } = await completedVisit("10:00 AM");
    for (const rating of [0, 6, 2.5, "abc", { $gt: 0 }]) {
      assert.equal((await review(user.token, appt._id, { rating })).body.success, false, JSON.stringify(rating));
    }
  });

  test("another patient cannot review someone else's visit", async () => {
    const { appt } = await completedVisit("11:00 AM");
    const stranger = await registerUser(ctx.request);
    assert.equal((await review(stranger.token, appt._id, { rating: 5 })).body.success, false);
  });

  test("one review per appointment; averages are recomputed; public list hides user ids", async () => {
    const first = await completedVisit("12:00 PM");
    const second = await completedVisit("12:30 PM");
    assert.equal((await review(first.user.token, first.appt._id, { rating: 5, comment: "Great doctor" })).body.success, true);
    const dup = await review(first.user.token, first.appt._id, { rating: 1 });
    assert.match(dup.body.message, /already/);
    assert.equal((await review(second.user.token, second.appt._id, { rating: 4 })).body.success, true);

    const fresh = await ctx.models.doctor.findById(doctor._id);
    assert.equal(fresh.ratingCount, 2);
    assert.equal(fresh.ratingAvg, 4.5);

    const list = await ctx.request.get(`/api/doctor/reviews/${doctor._id}`);
    assert.equal(list.body.reviews.length, 2);
    assert.equal("userId" in list.body.reviews[0], false);
    assert.ok(list.body.reviews[0].userName);

    const doctors = await ctx.request.get("/api/doctor/list");
    assert.equal(doctors.body.doctors.find((d) => d._id === String(doctor._id)).ratingAvg, 4.5);
  });

  test("reviews endpoint tolerates a bad doctor id", async () => {
    assert.equal((await ctx.request.get("/api/doctor/reviews/zzz")).body.success, false);
  });
});
