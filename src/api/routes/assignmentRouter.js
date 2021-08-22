import { Router } from "express";
import {
    protect,
    student,
    tutor,
    hasAccessToAssignment,
} from "../middlewares/auth.js";
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
router.get("/all", protect, getAllAssignments); // assignment feed

//all\completed

router.route("/:id/submissions").get(protect, tutor, getAssignmentSubmissions); // get submissions for an assignment

//Task #1: Create/Update/Delete an assignment as a tutor
router.route("/").post(protect, tutor, createAssignment); // create assignment
router
    .route("/:id")
    .put(protect, tutor, hasAccessToAssignment, updateAssignment); // update assignment
router
    .route("/:id")
    .delete(protect, tutor, hasAccessToAssignment, deleteAssignment); // delete assignment

//Tutor + Student : Get the details of an assignment
router.route("/:id").get(protect, hasAccessToAssignment, getAssignment); // read assignment

//Tutor : Student List on an assignment
router
    .route("/:id/students")
    .post(protect, tutor, hasAccessToAssignment, assignToStudents); // assign to assignment

//Task #2: Student : Adding a submission for an assignment as a student
router
    .route("/:id/upload")
    .post(protect, student, hasAccessToAssignment, uploadAssignment);
router
    .route("/:id/submit")
    .post(protect, student, hasAccessToAssignment, submitAssignment);

export default router;
