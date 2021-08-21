import { Router } from "express";
import { protect, student, tutor } from "../middlewares/auth.js";
import {
    getAllAssignments,
    getAssignmentSubmissions,
    getAssignment,
    getAllAssignmentDetails,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    assignToStudents,
    submitAssignment
} from "../controllers/assignmentController.js";

const router = Router();

//tutor routes

router.get("/assignment/all", protect, getAllAssignments);

router
    .route("/assignment/:id/submissions")
    .get(protect, tutor, getAssignmentSubmissions); // get submissions for an assignment
router.route("/assignment").post(protect, tutor, createAssignment); // create assignment
router.route("/assignment/:id").get(protect, tutor, getAssignment); // read assignment
router.route("/assignment/:id").put(protect, tutor, updateAssignment); // update assignment
router.route("/assignment/:id").delete(protect, tutor, deleteAssignment); // delete assignment

//Tutor : Student List on An assignment
router.route("/assignment/:id/students").post(protect, tutor, assignToStudents); // assign to assignment

//student routes
router.route("/assignment/:id/details").get(protect, student, getAssignment);

//student : submissions
router.route("/assignment/:id/submit").post(protect, student, submitAssignment);

export default router;
