import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { v2 as cloudinary } from "cloudinary";
import { boot, loginAdmin, registerUser } from "./helpers/app.js";

// the real upload goes to Cloudinary: replace it with a stub for the whole file
cloudinary.uploader.upload = async () => ({ secure_url: "https://img.test/uploaded.png" });

const PNG = Buffer.from("89504e470d0a1a0a", "hex"); // content is irrelevant, the mime type is validated

describe("admin: adding doctors", () => {
  let ctx, atoken;
  before(async () => {
    ctx = await boot();
    atoken = await loginAdmin(ctx.request);
  });
  after(() => ctx.stop());

  const addDoctor = (fields = {}, { image = true, token = atoken, mime = "image/png" } = {}) => {
    let req = ctx.request.post("/api/admin/add-doctor").set("atoken", token);
    const all = {
      name: "Dr. New",
      email: "New.Doc@Test.com",
      password: "Doctor@123",
      speciality: "Neurologist",
      degree: "MBBS",
      experience: "3 Years",
      about: "Bio",
      fees: "70",
      address: JSON.stringify({ line1: "a", line2: "b" }),
      ...fields,
    };
    for (const [k, v] of Object.entries(all)) if (v !== undefined) req = req.field(k, v);
    return image ? req.attach("image", PNG, { filename: "doc.png", contentType: mime }) : req;
  };

  test("creates a doctor with a hashed password, normalised email and the uploaded image URL", async () => {
    const res = await addDoctor();
    assert.equal(res.body.success, true);
    const doc = await ctx.models.doctor.findOne({ name: "Dr. New" });
    assert.equal(doc.image, "https://img.test/uploaded.png");
    assert.equal(doc.email, "new.doc@test.com");
    assert.notEqual(doc.password, "Doctor@123");
    assert.equal(doc.fees, 70);
    // the new doctor can log in
    const login = await ctx.request
      .post("/api/doctor/login")
      .send({ email: "new.doc@test.com", password: "Doctor@123" });
    assert.equal(login.body.success, true);
  });

  test("rejects duplicates, missing image, bad email, short password and invalid fees", async () => {
    assert.match((await addDoctor()).body.message, /already exists/);
    assert.equal(
      (await addDoctor({ email: "a@test.com" }, { image: false })).body.message,
      "Doctor image is required"
    );
    assert.match((await addDoctor({ email: "not-an-email" })).body.message, /valid email/);
    assert.match(
      (await addDoctor({ email: "b@test.com", password: "short" })).body.message,
      /at least 8/
    );
    assert.match((await addDoctor({ email: "c@test.com", fees: "-5" })).body.message, /valid fees/);
    assert.match(
      (await addDoctor({ email: "d@test.com", address: "{broken" })).body.message,
      /Invalid address/
    );
  });

  test("only images are accepted (400) and only admins may call it (401)", async () => {
    const notImage = await addDoctor({ email: "e@test.com" }, { mime: "text/plain" });
    assert.equal(notImage.status, 400);
    const patient = await registerUser(ctx.request);
    assert.equal((await addDoctor({ email: "f@test.com" }, { token: patient.token })).status, 401);
  });
});
