import express from "express";


import { protect } from "../middleware/authMiddleware.js";

import {
  createRecommendation,
  getRecommendation,
//   deleteRecmmendation,
  getAllRecommendations,
  // createmessage,
} from "../controllers/recommendationController.js";

const router = express.Router();
console.log("Recommendation routes loaded");
router.post("/", protect, createRecommendation);
router.get("/all", protect, getAllRecommendations);
router.get("/:id", protect, getRecommendation);
// router.delete("/:id", protect, deleteRecmmendation);

// router.post("/message", protect, createmessage);


export default router;