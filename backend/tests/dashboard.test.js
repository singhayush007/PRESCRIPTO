import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { boot, createDoctor, loginDoctor, loginAdmin } from "./helpers/app.js";

describe("dashboards, doctor profile and availability", () => {
  let ctx, doctor, atoken, dtoken;
  const DAY = 24 * 60 * 60 * 1000;

  before(async () => {
    ctx = await boot();
    doctor = await createDoctor(ctx.models, { fees: 80 });
    atoken = await loginAdmin(ctx.request);
    dtoken = await loginDoctor(ctx.request, doctor.email);

    const now = Date.now();
    const appt = (over) => ({ userId: "u" + Math.random(), docId: String(doctor._id), slotDate: "7_11_2026", slotTime: "10:00 AM", userData: { name: "P" }, docData: { name: doctor.name }, amount: 80, date: now, cancelled: false, payment: false, isCompleted: false, ...over });
    let n = 0;
    const slot = () => ({ slotTime: `0${++n}:00 AM` });
    await ctx.models.appointment.insertMany([
      appt(slot()), // pending
      appt({ ...slot(), payment: true }), // paid
      appt({ ...slot(), payment: true, isCompleted: true }), // completed (+revenue)
      appt({ ...slot(), cancelled: true, payment: true }), // cancelled: never revenue
      appt({ ...slot(), date: now - 3 * DAY, isCompleted: true }), // completed 3 days ago (+revenue)
      appt({ ...slot(), date: now - 20 * DAY }), // pending, older than the 7-day window
    ]);
  });
  after(() => ctx.stop());

  test("admin dashboard: counts, status breakdown, revenue and recent bookings", async () => {
    const { dashData: d } = (await ctx.request.get("/api/admin/dashboard").set("atoken", atoken)).body;
    assert.equal(d.doctors, 1);
    assert.equal(d.appointments, 6);
    assert.deepEqual(d.status, { cancelled: 1, completed: 2, paid: 1, pending: 2 });
    assert.equal(Object.values(d.status).reduce((a, b) => a + b, 0), d.appointments);
    assert.equal(d.revenue, 240); // paid + completed, cancelled excluded (3 x 80)
    assert.equal(d.recentBookings.length, 5); // the 20-day-old one is outside the window
    assert.equal(d.latestAppointments.length, 5);
  });

  test("doctor dashboard: earnings exclude cancelled, same status breakdown", async () => {
    const { dashData: d } = (await ctx.request.get("/api/doctor/dashboard").set("dtoken", dtoken)).body;
    assert.equal(d.earnings, 240);
    assert.equal(d.appointments, 6);
    assert.deepEqual(d.status, { cancelled: 1, completed: 2, paid: 1, pending: 2 });
    assert.equal(d.recentBookings.length, 5);
  });

  test("doctor can complete and cancel only their own appointments; cancelling frees the slot", async () => {
    const { request, models } = ctx;
    const other = await createDoctor(models);
    const otherToken = await loginDoctor(request, other.email);
    const appt = await models.appointment.findOne({ docId: String(doctor._id), cancelled: false, isCompleted: false });

    const hijack = await request.post("/api/doctor/complete-appointment").set("dtoken", otherToken).send({ appointmentId: String(appt._id) });
    assert.equal(hijack.body.success, false);

    await models.doctor.updateOne({ _id: doctor._id }, { $set: { [`slots_booked.${appt.slotDate}`]: [appt.slotTime] } });
    const cancel = await request.post("/api/doctor/cancel-appointment").set("dtoken", dtoken).send({ appointmentId: String(appt._id) });
    assert.equal(cancel.body.success, true);
    assert.deepEqual((await models.doctor.findById(doctor._id)).slots_booked[appt.slotDate], []);

    const done = await request.post("/api/doctor/complete-appointment").set("dtoken", dtoken).send({ appointmentId: String(appt._id) });
    assert.equal(done.body.success, false, "cancelled appointments cannot be completed");
  });

  test("doctor can update fees, address, availability and bio (blank bio keeps the old one)", async () => {
    const { request } = ctx;
    const update = (body) => request.post("/api/doctor/update-profile").set("dtoken", dtoken).send(body);
    assert.equal((await update({ fees: 95, about: "New bio", address: { line1: "x", line2: "y" }, available: false })).body.success, true);
    let profile = (await request.get("/api/doctor/profile").set("dtoken", dtoken)).body.profileData;
    assert.deepEqual([profile.fees, profile.about, profile.available], [95, "New bio", false]);
    await update({ fees: 95, about: "   ", address: { line1: "x", line2: "y" }, available: true });
    profile = (await request.get("/api/doctor/profile").set("dtoken", dtoken)).body.profileData;
    assert.equal(profile.about, "New bio");
    assert.equal((await update({ fees: -1, address: {}, available: true })).body.success, false);
    assert.equal("password" in profile, false);
  });

  test("availability can be toggled by admin; the public doctor list hides private fields", async () => {
    const { request } = ctx;
    const before = (await ctx.models.doctor.findById(doctor._id)).available;
    await request.post("/api/admin/change-availability").set("atoken", atoken).send({ docId: String(doctor._id) });
    assert.equal((await ctx.models.doctor.findById(doctor._id)).available, !before);
    const list = JSON.stringify((await request.get("/api/doctor/list")).body);
    assert.ok(!list.includes("password") && !list.includes('"email"'));
  });

  test("admin can cancel any appointment and see all doctors without passwords", async () => {
    const { request, models } = ctx;
    const appt = await models.appointment.findOne({ cancelled: false, isCompleted: false });
    const res = await request.post("/api/admin/cancel-appointment").set("atoken", atoken).send({ appointmentId: String(appt._id) });
    assert.equal(res.body.success, true);
    const all = (await request.get("/api/admin/all-doctors").set("atoken", atoken)).body.doctors;
    assert.ok(all.length >= 2 && all.every((d) => !("password" in d)));
  });
});
