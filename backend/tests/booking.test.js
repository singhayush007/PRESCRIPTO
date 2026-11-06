import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { boot, registerUser, createDoctor, book, myAppointments } from "./helpers/app.js";

describe("booking, rescheduling and cancelling", () => {
  let ctx, doctor;
  before(async () => {
    ctx = await boot();
    doctor = await createDoctor(ctx.models);
  });
  after(() => ctx.stop());

  const heldSlots = async (id = doctor._id) =>
    Object.values((await ctx.models.doctor.findById(id)).slots_booked).flat();

  test("books an appointment and holds the slot", async () => {
    const { request } = ctx;
    const user = await registerUser(request);
    const res = await book(request, user.token, doctor._id, "8_11_2026", "09:00 AM");
    assert.equal(res.body.success, true);
    assert.ok((await heldSlots()).includes("09:00 AM"));
    const [appt] = await myAppointments(request, user.token);
    assert.equal(appt.docData.name, doctor.name);
    assert.equal(appt.amount, 50);
  });

  test("10 concurrent bookings of the same slot produce exactly one appointment", async () => {
    const { request, models } = ctx;
    const users = await Promise.all(Array.from({ length: 10 }, () => registerUser(request)));
    const results = await Promise.all(
      users.map((u) => book(request, u.token, doctor._id, "9_11_2026", "10:00 AM"))
    );
    assert.equal(results.filter((r) => r.body.success).length, 1);
    assert.equal(
      await models.appointment.countDocuments({
        docId: String(doctor._id),
        slotDate: "9_11_2026",
        slotTime: "10:00 AM",
      }),
      1
    );
    assert.equal((await heldSlots()).filter((t) => t === "10:00 AM").length, 1);
  });

  test("the database itself refuses two active appointments for one slot", async () => {
    const { models } = ctx;
    const base = {
      userId: "u1",
      docId: String(doctor._id),
      slotDate: "20_11_2026",
      slotTime: "11:00 AM",
      userData: {},
      docData: {},
      amount: 1,
      date: 1,
    };
    await models.appointment.create(base);
    await assert.rejects(
      models.appointment.create({ ...base, userId: "u2" }),
      (err) => err.code === 11000
    );
    // ...but a cancelled appointment does not block the slot
    await models.appointment.updateOne(
      { userId: "u1", slotDate: "20_11_2026" },
      { cancelled: true }
    );
    await models.appointment.create({ ...base, userId: "u3" });
  });

  test("validates ids, dates and times without crashing", async () => {
    const { request } = ctx;
    const { token } = await registerUser(request);
    for (const body of [
      { docId: "123", slotDate: "7_11_2026", slotTime: "10:00 AM" },
      { docId: String(doctor._id), slotDate: "bad", slotTime: "10:00 AM" },
      { docId: String(doctor._id), slotDate: "7_11_2026", slotTime: "" },
      { docId: String(doctor._id), slotDate: { $gt: "" }, slotTime: "10:00 AM" },
    ]) {
      const res = await request.post("/api/user/book-appointment").set("token", token).send(body);
      assert.equal(res.body.success, false, JSON.stringify(body));
    }
  });

  test("refuses to book an unavailable doctor", async () => {
    const { request, models } = ctx;
    const away = await createDoctor(models, { available: false });
    const { token } = await registerUser(request);
    const res = await book(request, token, away._id);
    assert.equal(res.body.message, "Doctor Not Available");
  });

  describe("cancel", () => {
    test("owner can cancel once; the slot is released; others cannot cancel", async () => {
      const { request } = ctx;
      const owner = await registerUser(request);
      const other = await registerUser(request);
      await book(request, owner.token, doctor._id, "10_11_2026", "12:00 PM");
      const [appt] = await myAppointments(request, owner.token);

      const stranger = await request
        .post("/api/user/cancel-appointment")
        .set("token", other.token)
        .send({ appointmentId: appt._id });
      assert.equal(stranger.body.success, false);

      const first = await request
        .post("/api/user/cancel-appointment")
        .set("token", owner.token)
        .send({ appointmentId: appt._id });
      assert.equal(first.body.success, true);
      assert.ok(!(await heldSlots()).includes("12:00 PM"), "slot should be free again");

      const again = await request
        .post("/api/user/cancel-appointment")
        .set("token", owner.token)
        .send({ appointmentId: appt._id });
      assert.equal(again.body.success, false);
      // and somebody else can now take it
      assert.equal(
        (await book(request, other.token, doctor._id, "10_11_2026", "12:00 PM")).body.success,
        true
      );
    });

    test("garbage appointment ids do not crash", async () => {
      const { token } = await registerUser(ctx.request);
      const res = await ctx.request
        .post("/api/user/cancel-appointment")
        .set("token", token)
        .send({ appointmentId: "nope" });
      assert.equal(res.body.success, false);
    });
  });

  describe("reschedule", () => {
    const reschedule = (token, appointmentId, slotDate, slotTime) =>
      ctx.request
        .post("/api/user/reschedule-appointment")
        .set("token", token)
        .send({ appointmentId, slotDate, slotTime });

    test("moves to a free slot: old slot freed, new slot held", async () => {
      const { request } = ctx;
      const user = await registerUser(request);
      await book(request, user.token, doctor._id, "11_11_2026", "01:00 PM");
      const [appt] = await myAppointments(request, user.token);
      const res = await reschedule(user.token, appt._id, "12_11_2026", "02:00 PM");
      assert.equal(res.body.success, true);
      const held = await heldSlots();
      assert.ok(!held.includes("01:00 PM") && held.includes("02:00 PM"));
      const [moved] = await myAppointments(request, user.token);
      assert.deepEqual([moved.slotDate, moved.slotTime], ["12_11_2026", "02:00 PM"]);
    });

    test("a failed reschedule never loses the original slot", async () => {
      const { request } = ctx;
      const a = await registerUser(request);
      const b = await registerUser(request);
      await book(request, a.token, doctor._id, "13_11_2026", "03:00 PM");
      await book(request, b.token, doctor._id, "13_11_2026", "03:30 PM");
      const [apptA] = await myAppointments(request, a.token);
      const res = await reschedule(a.token, apptA._id, "13_11_2026", "03:30 PM"); // taken by b
      assert.equal(res.body.message, "Slot Not Available");
      assert.ok((await heldSlots()).includes("03:00 PM"), "original slot must still be held");
    });

    test("rejects the same slot, other people's appointments and finished appointments", async () => {
      const { request, models } = ctx;
      const a = await registerUser(request);
      const b = await registerUser(request);
      await book(request, a.token, doctor._id, "14_11_2026", "04:00 PM");
      const [appt] = await myAppointments(request, a.token);
      assert.equal(
        (await reschedule(a.token, appt._id, "14_11_2026", "04:00 PM")).body.success,
        false
      );
      assert.equal(
        (await reschedule(b.token, appt._id, "15_11_2026", "04:00 PM")).body.success,
        false
      );
      await models.appointment.updateOne({ _id: appt._id }, { isCompleted: true });
      assert.equal(
        (await reschedule(a.token, appt._id, "15_11_2026", "04:00 PM")).body.success,
        false
      );
    });
  });
});
