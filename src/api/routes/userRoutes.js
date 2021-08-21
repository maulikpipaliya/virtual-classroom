import { Router } from "express";
// import { protect, tutor, student } from "../middlewares/auth.js";

import {
    registerUser,
    getUsers,
    createUser,
    getUserByUsername,
    signIn,
    updatePassword,
} from "../controllers/userController.js";

import { protect, admin } from "../middlewares/auth.js";

const router = Router();

//Admin routes
router.route("/").get(protect, admin, getUsers);
router.route("/").post(protect, admin, createUser);
router.route("/signIn").post(signIn);
router.route("/:username").get(protect, getUserByUsername);
// router.route("/register").post(registerUser);

export default router;
