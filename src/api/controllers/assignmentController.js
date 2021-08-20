import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import { assignmentStatus } from "../../models/assignmentModel.js";

// create an assignment
export const createAssignment = asyncHandler(async (req, res, next) => {
    const {
        name,
        description,
        publishDate,
        dueDate,
        status,
        createdBy,
        assignedTo,
    } = req.body;

    // create new assignment
    const newAssignment = await Assignment.create({
        name,
        description,
        publishDate,
        dueDate,
        status,
        createdBy,
        assignedTo,
    });

    // send response
    res.status(201).json({
        success: true,
        data: newAssignment,
    });
});

// get all assignments
export const getAllAssignments = asyncHandler(async (req, res, next) => {
    const assignments = await Assignment.find();

    // send response
    res.status(200).json({
        success: true,
        data: assignments,
    });
});

//update an assignment
export const updateAssignment = asyncHandler(async (req, res, next) => {
    const {
        name,
        description,
        publishDate,
        dueDate,
        status,
        createdBy,
        assignedTo,
    } = req.body;

    // find assignment
    const assignment = await Assignment.findById(req.params.id);

    // update assignment
    assignment.name = name;
    assignment.description = description;
    assignment.publishDate = publishDate;
    assignment.dueDate = dueDate;
    assignment.status = status;
    assignment.createdBy = createdBy;
    assignment.assignedTo = assignedTo;

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
