import express from 'express';

import {integrate_Leetcode } from "../controllers/integrateController.js"

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
console.log("Ingegrate Routes loaded");

router.put ("/leetcode" , protect , integrate_Leetcode);


export default router;