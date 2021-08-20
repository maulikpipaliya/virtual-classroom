import { Router } from "express";
// import { protect, tutor, student } from "../middlewares/auth.js";

import {
    registerUser,
    getUsers,
    createUser,
    getUserByUsername,
    authenticateUser,
} from "../controllers/userController.js";

import { protect } from "../middlewares/auth.js";

const router = Router();

router.route("/").get(protect, getUsers);
router.route("/").post(createUser);
router.route("/register").post(registerUser);
router.route("/login").post(authenticateUser);
router.route("/:username").get(getUserByUsername);

export default router;
