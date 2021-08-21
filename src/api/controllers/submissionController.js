import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import Submission from "../../models/submissionModel.js";
import Assignment from "../../models/assignmentModel.js";
import { allRoles } from "../../models/roleModel.js";

// add Submission

export const addSubmission = asyncHandler(async (req, res, next) => {
    const {
        name,
        description,
        publishDate,
        dueDate,
        status,
        createdBy,
        assignedTo,
    } = req.body;
});
