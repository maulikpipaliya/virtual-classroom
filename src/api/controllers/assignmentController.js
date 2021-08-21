import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import Assignment from "../../models/assignmentModel.js";
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

// TUTOR: get all assignments for a tutor
export const getAllAssignments = asyncHandler(async (req, res, next) => {
    console.log("getAllAssignments API Called");
    console.log(req.user);

    const { _id: userId } = req.user;

    const roleDetails = await getRoleFromUserId(userId);

    if (roleDetails && roleDetails.roleName === "TUTOR") {
        //return all the assignments
        console.log("IS TUTOR");
        const assignments = await Assignment.find({
            createdBy: userId,
        });

        // send response
        res.status(200).json({
            success: true,
            data: {
                assignments,
                user: req.user,
            },
        });
    }

    if (roleDetails && roleDetails.roleName === "STUDENT") {
        //return all assigned assignments
        console.log("IS STUDENT");
        const assignments = await Assignment.find({
            assignedTo: userId,
        });

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
    const { _id } = req.user;

    if (getRoleFromUserId(_id) && getRoleFromUserId(_id).roleName === "TUTOR") {
        console.log("TUTOR is working");
    }

    if (roleName === "TUTOR") {
        //return all the assignments with submissions
        console.log("IS TUTOR");
        const assignment = await Assignment.findById(req.params.id);
        const submissions = await Assignment.findById(req.params.id).populate(
            "submissions"
        );
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
        const submission = await Submission.findOne({
            assignmentId: req.params.id,
            userId: _id,
        });
        // send response
        res.status(200).json({
            success: true,
            data: {
                submission,
                user: req.user,
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
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res
                .status(400)
                .send({ message: "File is undefined or not provided!" });
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
    console.log("submitAssignment API Called");
    const { id: assignmentId } = req.params;
    const { file } = req.files;
    const { _id: studentId } = req.user;
    const student = await User.findById(studentId);
    const assignment = await Assignment.findById(assignmentId);
    const submission = await Submission.findOne({
        assignmentId: assignmentId,
        userId: studentId,
    });

    //receive the file and save it in content
    const content = file.path;
});
