import express from "express";
import { handleAuth } from "../controllers/authController.js"; // Import the auth controller
const router = express.Router();

router.post("/login", handleAuth);

export default router; // ✅ Use 'export default' instead of 'module.exports'
