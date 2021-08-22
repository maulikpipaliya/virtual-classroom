import { Router } from "express";

import { signIn } from "../controllers/authController.js";

const router = Router();

//Admin, Tutor, Student : sign in the system
router.route("/signIn").post(signIn);

export default router;
