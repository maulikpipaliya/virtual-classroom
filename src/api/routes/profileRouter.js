import { Router } from "express";

import { getProfile } from "../controllers/profileController.js";
import { upload } from "../controllers/fileController.js";
import { protect, student, tutor } from "../middlewares/auth.js";

const router = Router();

//tutor routes

//Task #4 : Tutor + Student : Assignment Feed
router.get("/profile", protect, getProfile); // assignment feed

export default router;
