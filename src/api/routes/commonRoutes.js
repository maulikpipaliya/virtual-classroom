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
    submitAssignment,
    uploadAssignment,
} from "../controllers/assignmentController.js";
import { upload } from "../controllers/fileController.js";

const router = Router();

//tutor routes

//Task #4 : Tutor + Student : Assignment Feed
router.get("/assignment/all", protect, getAllAssignments); // assignment feed

router
    .route("/assignment/:id/submissions")
    .get(protect, tutor, getAssignmentSubmissions); // get submissions for an assignment

//Task #1: Create/Update/Delete an assignment as a tutor
router.route("/assignment").post(protect, tutor, createAssignment); // create assignment
router.route("/assignment/:id").put(protect, tutor, updateAssignment); // update assignment
router.route("/assignment/:id").delete(protect, tutor, deleteAssignment); // delete assignment

//Tutor + Student : Get the details of an assignment
router.route("/assignment/:id").get(protect, tutor, getAssignment); // read assignment

//Tutor : Student List on an assignment
router.route("/assignment/:id/students").post(protect, tutor, assignToStudents); // assign to assignment

//Task #2: Student : Adding a submission for an assignment as a student
router.route("/assignment/:id/upload").post(protect, student, uploadAssignment);
router.route("/assignment/:id/submit").post(protect, student, submitAssignment);

export default router;
