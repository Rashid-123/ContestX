import express from "express";

import { protect } from "../middleware/authMiddleware";
import {
  createRecmmendation,
//   getRecmmendation,
//   deleteRecmmendation,
//   getAllRecmmendations,
} from "../controllers/recommendationController";
const router = express.Router();

router.post("/", protect, createRecmmendation);
// router.get("/:id", protect, getRecmmendation);
// router.delete("/:id", protect, deleteRecmmendation);
// router.get("/all", protect, getAllRecmmendations);