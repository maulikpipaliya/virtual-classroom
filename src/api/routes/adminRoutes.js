import { Router } from "express";

import {
    getUsers,
    createUser,
    getUserByNameOrId,
} from "../controllers/adminController.js";

import { protect, admin } from "../middlewares/auth.js";

const router = Router();

//Admin routes

//Admin : gets all users
router.route("/").get(protect, admin, getUsers);

//Admin : creates a new user
router.route("/").post(protect, admin, createUser);

//Admin: gets a user by name or id
router.route("/:usernameOrId").get(protect, admin, getUserByNameOrId);

export default router;
