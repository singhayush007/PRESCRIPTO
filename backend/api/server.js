import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../config/mongodb.js";
import connectCloudinary from "../config/cloudinary.js";

import userRouter from "../routes/userRoute.js";
import doctorRouter from "../routes/doctorRoute.js";
import adminRouter from "../routes/adminRoute.js";

// Initialize
const app = express();

// Connect DB & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.get("/", (req, res) => {
  res.send("API Working - Vercel");
});

// ADD THIS ↓↓↓
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});

export default app;

