import express from "express";
import handleLogin from "../controllers/authController.js"; // Use 'import' instead of 'require'

const router = express.Router();

router.post("/login", handleLogin);

export default router; // ✅ Use 'export default' instead of 'module.exports'
