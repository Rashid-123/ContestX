
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import integateRoutes from "./routes/integrateRoutes.js";
import recommendRoutes from "./routes/recommendRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


const FRONTEND_URLS = [
  "https://next-step-iota-liard.vercel.app", // production
  "http://localhost:3000", // development
];

// Middleware
app.use(
  cors({
    origin: FRONTEND_URLS, // Allow both URLs
    credentials: true, // Enable cookies & authentication headers
  })
);


app.use(express.json());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));
 
app.get("/api/ping", (req, res) => {
  console.log("Ping , Bakend is awake !")
  res.status(200).json({ status: "ok", message: "Backend is awake!" });
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookmark", bookmarkRoutes);
app.use("/api/integrate", integateRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/payment", paymentRoutes)

//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
