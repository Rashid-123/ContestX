import express from "express";

import { create_order , verify_payment } from "../controllers/paymentController.js";
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();
console.log("Purchase Routes loaded");

router.post("/create-order",protect, create_order);
router.post("/verify" ,protect, verify_payment)

export default router;