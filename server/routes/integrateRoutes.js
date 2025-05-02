import express from 'express';

import {integrate_Leetcode , integrate_Github} from "../controllers/integrateController.js"

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
console.log("Ingegrate Routes loaded");

router.put ("/leetcode" , protect , integrate_Leetcode);
router.put ("/github" , protect , integrate_Github);

export default router;