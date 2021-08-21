import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import Assignment from "../../models/assignmentModel.js";
import { assignmentStatusScope } from "../../models/assignmentModel.js";
import { student, tutor } from "../middlewares/auth.js";

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

    const { _id } = req.user;

    const userObj = await User.findOne({ _id }, { role: 1 });
    console.log("User is ", userObj);

    const { roleName } = await Role.findOne({ _id: userObj.role });
    console.log("Role is ", roleName);

    if (roleName === "TUTOR") {
        //return all the assignments
        console.log("IS TUTOR");
        const assignments = await Assignment.find({
            createdBy: _id,
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

    if (roleName === "STUDENT") {
        //return all assigned assignments
        console.log("IS STUDENT");
        const assignments = await Assignment.find({
            assignedTo: _id,
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

//TUTOR: get an assignment
export const getAssignment = asyncHandler(async (req, res, next) => {
    const assignment = await Assignment.findById(req.params.id);
    const submissions = await Assignment.findById(req.params.id).populate(
        "submissions"
    );

    // send response
    res.status(200).json({
        success: true,
        data: {
            assignment,
            submissions,
        },
    });
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
    const { _id: studentIds } = req.body;

    let studentIdsArray;
    if (studentIds) {
        studentIdsArray = studentIds.split(",");
    }

    try {
        const assignment = await Assignment.findById(assignmentId);

        console.log("assignment");
        console.log(assignment);

        const students = await User.find({ _id: { $in: studentIdsArray } });

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

        //roleId of student
        const { _id: roleId } = await Role.findOne({ roleName: "STUDENT" });

        const randomStudents = await User.aggregate([
            { $match: { role: roleId } },
            { $sample: { size: 3 } },
        ]).exec();

        const ids = randomStudents.map((student) => {
            return student._id;
        });
        console.log(ids);

        console.log("students");
        console.log(students);
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

/**
 * @apiName Submit assignment
 * @apiGroup Assignment
 * @api {post} /assignment/:id/submit    Submit assignment
 * @apiParam {File} File    content
 * @apiContentType application/json
 */
export const submitAssignment = asyncHandler(async (req, res, next) => {
    console.log("submitAssignment API Called");
});
