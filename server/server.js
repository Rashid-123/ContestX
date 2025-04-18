
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
// import bookmarkRoutes from "./routes/bookmarkRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middleware
app.use(
  cors({
    origin: [FRONTEND_URL], // Allow both URLs
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

// Routes
app.use("/api/auth", authRoutes);
console.log("Auth Routes Loaded");
console.log("Bookmark Routes Loaded");
// app.use("/api/bookmark" , bookmarkRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
