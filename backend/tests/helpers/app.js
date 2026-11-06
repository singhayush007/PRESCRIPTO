import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import supertest from "supertest";

export const ADMIN = { email: "admin@test.com", password: "adminpass1" };
export const DOCTOR_PASSWORD = "Doctor@123";

/**
 * Boots the real Express app against a throw-away in-memory MongoDB.
 * Environment is set BEFORE the app is imported, and .env files are ignored, so tests are hermetic
 * (never touch a real database, Stripe, Razorpay or Cloudinary).
 */
export async function boot(extraEnv = {}) {
  const mongod = await MongoMemoryServer.create();
  Object.assign(process.env, {
    DOTENV_CONFIG_PATH: "tests/.no-env-file",
    NODE_ENV: "test",
    JWT_SECRET: "test-secret",
    ADMIN_EMAIL: ADMIN.email,
    ADMIN_PASSWORD: ADMIN.password,
    MONGODB_URI: mongod.getUri().replace(/\/$/, ""),
    RATE_LIMIT_MAX: "100000",
    AUTH_RATE_LIMIT_MAX: "100000",
    CURRENCY: "USD",
    STRIPE_SECRET_KEY: "",
    RAZORPAY_KEY_ID: "",
    RAZORPAY_KEY_SECRET: "",
    CORS_ORIGINS: "",
    ...extraEnv,
  });

  const { default: app } = await import("../../app.js");
  const { default: connectDB } = await import("../../config/mongodb.js");
  await connectDB();

  const models = {
    user: (await import("../../models/userModel.js")).default,
    doctor: (await import("../../models/doctorModel.js")).default,
    appointment: (await import("../../models/appointmentModel.js")).default,
    review: (await import("../../models/reviewModel.js")).default,
  };
  await models.appointment.init(); // make sure indexes (incl. the unique slot index) exist

  const request = supertest(app);
  const stop = async () => {
    await mongoose.disconnect();
    await mongod.stop();
  };
  return { app, request, models, stop };
}

let counter = 0;

/** Registers a patient through the API and returns { token, email, id }. */
export async function registerUser(request, name = "Test Patient") {
  const email = `patient${++counter}@test.com`;
  const res = await request.post("/api/user/register").send({ name, email, password: "Password1!" });
  if (!res.body.success) throw new Error(`register failed: ${res.body.message}`);
  return { token: res.body.token, email };
}

/** Inserts a doctor straight into the database (the add-doctor API needs Cloudinary). */
export async function createDoctor(models, overrides = {}) {
  const n = ++counter;
  return models.doctor.create({
    name: `Dr. Test ${n}`,
    email: `doctor${n}@test.com`,
    password: await bcrypt.hash(DOCTOR_PASSWORD, 4),
    image: "https://img.test/doc.png",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about: "Experienced doctor",
    fees: 50,
    address: { line1: "1 Test St", line2: "Testville" },
    date: Date.now(),
    ...overrides,
  });
}

export const loginDoctor = async (request, email) =>
  (await request.post("/api/doctor/login").send({ email, password: DOCTOR_PASSWORD })).body.token;

export const loginAdmin = async (request) => (await request.post("/api/admin/login").send(ADMIN)).body.token;

/** Books tomorrow-ish slot through the API; returns the response body. */
export const book = (request, token, docId, slotDate = "7_11_2026", slotTime = "10:00 AM") =>
  request.post("/api/user/book-appointment").set("token", token).send({ docId: String(docId), slotDate, slotTime });

export const myAppointments = async (request, token) =>
  (await request.get("/api/user/appointments").set("token", token)).body.appointments;
