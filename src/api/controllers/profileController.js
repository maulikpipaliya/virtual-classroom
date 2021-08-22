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

export const getProfile = asyncHandler(async (req, res, next) => {
    try {
        if (!req.user) {
            return next();
        }

        const { _id: userId } = req.user;

        const roleDetails = await getRoleFromUserId(userId);

        const userDetails = await User.findOne({ _id: userId });

        if (userDetails) {
            res.status(200).json({
                user: userDetails,
                role: roleDetails,
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});
