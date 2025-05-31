import express from "express";

import { create_order , verify_payment } from "../controllers/paymentController.js";

const router = express.Router();
console.log("Purchase Routes loaded");

router.post("/create-order", create_order);
router.post("/verify" , verify_payment)

export default router;