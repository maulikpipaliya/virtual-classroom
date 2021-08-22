import { Router } from "express";
import {
    createAssignment,
    getAssignment,
    getAllAssignments,
    updateAssignment,
    deleteAssignment,
} from "../../controllers/assignmentController.js";
import { signIn } from "../../controllers/authController.js";

const router = Router();

import { protect, tutor } from "../../middlewares/auth.js";

router.route("/createAssignment").post(protect, tutor, createAssignment);
router.route("/getAssignment").get(protect, tutor, getAssignment);
router.route("/updateAssignment").put(protect, tutor, updateAssignment);
router.route("/deleteAssignment").delete(protect, tutor, deleteAssignment);

export default router;
