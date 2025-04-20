import express from   "express";
import {
  getallBookmarks,
  toggleBookmark,
} from "../controllers/bookmarkController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
console.log("Bookmark routes loaded");
router.post("/", protect, toggleBookmark);
router.get("/", protect, getallBookmarks); 


export default router;