import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import Assignment from "../../models/assignmentModel.js";
import Submission from "../../models/submissionModel.js";
import { assignmentStatusScope } from "../../models/assignmentModel.js";
import { student, tutor } from "../middlewares/auth.js";
import {
    getRandomStudents,
    getRoleFromUserId,
} from "../../models/modelHelpers.js";
import uploadFile from "../middlewares/uploadFileMiddleware.js";

// TUTOR : create an assignment
export const createAssignment = asyncHandler(async (req, res, next) => {
    console.log("createAssignment API Called");
    const { name, description, publishDate, dueDate, status, assignedTo } =
        req.body;

    const createdBy = req.user._id;

    console.log("createdBy");
    const { _id: roleIdOfStudent } = await Role.findOne({
        roleName: "STUDENT",
    });

    const randomStudents = User.aggregate([
        { $sample: { size: 10 } },
        { $match: { role: roleIdOfStudent } },
    ]);

    console.log("randomStudents");
    console.log(randomStudents);
    console.log(randomStudents._pipeline);
    // create new assignment
    const newAssignment = await Assignment.create({
        name,
        description,
        publishDate,
        dueDate,
        createdBy: createdBy,
        // assignedTo: randomStudents,
    });

    // send response
    res.status(201).json({
        success: true,
        data: newAssignment,
    });
});

export const getAssignmentOld = asyncHandler(async (req, res, next) => {
    console.log("getAssignment API Called");
    const { _id: assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    res.status(200).json({
        success: true,
        data: assignment,
    });
});

//tutor + student -> get all assignments
export const getAllAssignments = asyncHandler(async (req, res, next) => {
    console.log("getAllAssignments API Called");
    console.log(req.user);

    //get query params

    const { status, publishDate } = req.query;

    console.log(req.query);

    const { _id: userId } = req.user;

    const roleName = req.roleName;

    console.log("req.params");
    console.log(req.params);

    if (roleName === "TUTOR") {
        //return all the assignments
        console.log("IS TUTOR");
        let assignments = await Assignment.find({
            createdBy: userId,
        });

        if (status) {
            console.log("status filter is applied");
            assignments = assignments.filter(
                (assignment) =>
                    status.toUpperCase() === assignment.status.toUpperCase()
            );
        }
        if (publishDate) {
            console.log("publishDate filter is applied");
            assignments = assignments.filter(
                (assignment) =>
                    assignment.publishDate.getTime() === publishDate.getTime()
            );
        }

        // send response
        res.status(200).json({
            success: true,
            data: {
                assignments,
                user: req.user,
            },
        });
    }

    if (roleName === "STUDENT") {
        //return all assigned assignments
        console.log("IS STUDENT");
        let assignments = await Assignment.find({
            assignedTo: userId,
        });

        console.log(assignments);
        if (status) {
            console.log("status filter is applied");
            assignments = assignments.filter(
                (assignment) =>
                    status.toUpperCase() === assignment.status.toUpperCase()
            );
        }
        if (publishDate) {
            console.log("publishDate filter is applied");
            assignments = assignments.filter(
                (assignment) =>
                    assignment.publishDate.getTime() === publishDate.getTime()
            );
        }

        // send response
        res.status(200).json({
            success: true,
            data: { assignments, user: req.user },
        });
    }
});

//TUTOR : update an assignment
export const updateAssignment = asyncHandler(async (req, res, next) => {
    console.log("updateAssignment API Called");

    console.log("req.body");
    console.log(req.body);

    // find assignment
    const assignment = await Assignment.findById(req.params.id);

    //check if assignment belongs to the user
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
        res.status(403).json({
            success: false,
            message: "You are not authorized to update this assignment",
        });
    }

    if (assignment && req.body && Object.keys(req.body).length > 0) {
        Object.keys(req.body).map((key) => {
            assignment[key] = req.body[key];
        });
    }

    // save assignment
    await assignment.save();

    // send response
    res.status(200).json({
        success: true,
        data: assignment,
    });
});

//delete an assignment
export const deleteAssignment = asyncHandler(async (req, res, next) => {
    await Assignment.findByIdAndDelete(req.params.id);

    // send response
    res.status(200).json({
        success: true,
        data: {},
    });
});

export const getAssignmentSubmissions = asyncHandler(async (req, res, next) => {
    //get all submissions
    const submissions = await Assignment.findById(req.params.id).populate(
        "submissions"
    );

    console.log("submissions");
    console.log(submissions);

    // send response
    res.status(200).json({
        success: true,
        data: {
            user: req.user,
            submissions,
        },
    });
});

//Tutor + Student : Get the details of an assignment
export const getAssignment = asyncHandler(async (req, res, next) => {
    console.log("getAssignment API Called");

    if (!req.user) {
        res.status(403).json({
            success: false,
            message: "You are not authorized to view this assignment",
        });
    }

    const roleName = req.roleName;

    const assignmentId = req.params.id;
    //verify if the assignment belongs to the user
    const assignment = await Assignment.findById(assignmentId);

    const { _id } = req.user;

    const roleDetails = await getRoleFromUserId(_id);

    if (roleName === "TUTOR") {
        console.log("TUTOR is working");
    }

    if (roleName === "TUTOR") {
        //return all the assignments with submissions
        console.log("IS TUTOR");

        if (assignment.createdBy.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to view this assignment",
            });
        }

        const submissions = await Submission.findById(assignmentId);
        // send response
        res.status(200).json({
            success: true,
            data: {
                assignment,
                user: req.user,
                submissions,
            },
        });
    }
    if (roleName === "STUDENT") {
        //return student's submission
        console.log("IS STUDENT");

        const { _id: studentId } = req.user;

        const submission = await Submission.findOne({
            assignmentId,
            studentId,
        });

        // send response
        res.status(200).json({
            success: true,
            data: {
                submission,
                user: req.user,
                assignment,
            },
        });
    }
    // send response
});

//STUDENT : get all assignments for a particular student
export const getAllAssignmentDetails = asyncHandler(async (req, res, next) => {
    const { _id: studentId } = req.user;
    const student = await User.findById(studentId);

    //find all assignments for a student
    const assignments = await Assignment.find({
        assignedTo: studentId,
    });

    // send response
    res.status(200).json({
        success: true,
        data: assignments,
    });
});

//TUTOR:    set students on an assignment
export const assignToStudents = asyncHandler(async (req, res, next) => {
    console.log("assignToStudents API Called");

    const { id: assignmentId } = req.params;

    //data should be sent in the request body from the frontend (ObjIDs)
    //sample: 6120a6b11c7b7f35a8495ba2,6120a6b11c7b7f35a8495ba3,6120a6b11c7b7f35a8495ba3
    const { studentList: studentIds } = req.body;

    try {
        const assignment = await Assignment.findById(assignmentId);

        console.log("assignment");
        console.log(assignment);

        const students = await User.find({ _id: { $in: studentIds } });

        if (!assignment) {
            res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        if (!students) {
            res.status(404).json({
                success: false,
                message: "Students not found",
            });
        }

        const randomStudents = await getRandomStudents(3);

        const ids = randomStudents.map((student) => {
            return student._id;
        });

        //assign students to assignment
        assignment.assignedTo = ids;
        assignment.save();

        //send response
        res.status(200).json({
            success: true,
            data: {
                assignment,
                students,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            data: error,
        });
    }
});

export const uploadAssignment = asyncHandler(async (req, res, next) => {
    console.log("uploadAssignment API Called");

    console.log("Upload API called");
    try {
        console.log(req.user);
        const { id: assignmentId } = req.params;
        const { _id: studentId } = req.user;

        await uploadFile(req, res);

        console.log("req.file");
        console.log(req.file);

        if (req.file === undefined) {
            return res
                .status(400)
                .send({ message: "File is undefined or not provided!" });
        }

        console.log("submission start");
        //update the assignment , change content
        // const submission = await Submission.findOne({
        //     assignmentId,
        //     studentId: req.user._id,
        // });

        const submission = await Submission.findOne({
            assignmentId,
            studentId: req.user._id,
        });

        if (!submission) {
            await Submission.create({
                assignmentId,
                studentId: req.user._id,
                content: req.file.originalname,
            });
        } else {
            await Submission.findOneAndUpdate(
                {
                    assignmentId,
                    studentId: req.user._id,
                },
                {
                    $set: {
                        content: req.file.originalname,
                    },
                }
            );
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (error) {
        res.status(500).send({
            message: `Could not upload the file: ${error}`,
        });
    }
});

export const submitAssignment = asyncHandler(async (req, res, next) => {
    try {
        console.log("submitAssignment API Called");
        const { id: assignmentId } = req.params;
        const { _id: studentId } = req.user;

        const submission = await Submission.findOne({
            assignmentId,
            studentId: req.user._id,
        });

        if (submission) {
            await Submission.findOneAndUpdate(
                {
                    assignmentId,
                    studentId,
                },
                {
                    $set: {
                        status: "SUBMITTED",
                    },
                }
            );
        } else {
            //create submission
            await Submission.create({
                assignmentId,
                studentId,
                status: "SUBMITTED",
            });
        }

        res.status(200).send({
            message: "Submitted the assignment successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: `Could not submit the assignment: ${error}`,
        });
    }
});
