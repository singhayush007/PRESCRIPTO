import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "./user.model.js";
import { uploadImage } from "../../shared/utils/helpers.js";
import { fail, serverError } from "../../shared/utils/http.js";

const TOKEN_EXPIRY = "7d";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (![name, email, password].every((v) => typeof v === "string" && v.trim())) {
      return fail(res, "Missing Details");
    }
    if (!validator.isEmail(email)) {
      return fail(res, "Please enter a valid email");
    }
    if (password.length < 8) {
      return fail(res, "Password must be at least 8 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new userModel({
      name: name.trim(),
      email: validator.normalizeEmail(email) || email.toLowerCase(),
      password: hashedPassword,
    }).save();

    res.json({ success: true, token: signToken(user._id) });
  } catch (error) {
    if (error.code === 11000) return fail(res, "Email already registered");
    serverError(res, error);
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // typeof checks block NoSQL injection payloads like { "$ne": null }
    if (typeof email !== "string" || typeof password !== "string") {
      return fail(res, "Invalid credentials");
    }

    const user = await userModel.findOne({
      email: validator.normalizeEmail(email) || email.toLowerCase(),
    });
    // same message for unknown email / wrong password (no account enumeration)
    if (!user) return fail(res, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return fail(res, "Invalid credentials");

    res.json({ success: true, token: signToken(user._id) });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) return fail(res, "User not found");

    res.json({ success: true, userData });
  } catch (error) {
    serverError(res, error);
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return fail(res, "Data Missing");
    }

    let parsedAddress = { line1: "", line2: "" };
    if (address) {
      try {
        parsedAddress = JSON.parse(address);
      } catch {
        return fail(res, "Invalid address");
      }
    }

    const update = { name: name.trim(), phone, address: parsedAddress, dob, gender };
    if (imageFile) update.image = await uploadImage(imageFile);

    await userModel.findByIdAndUpdate(userId, update);

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    serverError(res, error);
  }
};

export { loginUser, registerUser, getProfile, updateProfile };
