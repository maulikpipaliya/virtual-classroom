import { Router } from "express";
// import { protect, tutor, student } from "../middlewares/auth.js";

import {
    createAssignment,
    getAssignments,
    updateAssignment,
    deleteAssignment,
} from "../controllers/AssignmentController.js";

import { protect, student, tutor } from "../middlewares/auth.js";

const router = Router();

router.route("/create").post(protect, tutor, createAssignment);
router.route("/delete").post(protect, tutor, deleteAssignment);
router.route("/update").post(protect, tutor, updateAssignment);
router.route("/").post(protect, tutor, getAssignments);

export default router;
