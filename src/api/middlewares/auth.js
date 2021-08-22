import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import colors from "colors";
import Role from "../../models/roleModel.js";
import Assignment from "../../models/assignmentModel.js";
import { getRoleFromUserId } from "../../models/modelHelpers.js";

export const protect = asyncHandler(async (req, res, next) => {
    console.log("Verifying that user is authenticated");

    let reqAuth = req.headers.authorization;

    let token;

    if (reqAuth && reqAuth.startsWith("Bearer")) {
        try {
            token = reqAuth.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_PASSWORD);

            console.log("decoded");
            console.log(decoded);
            //does not include password
            req.user = await User.findOne({
                _id: decoded._id,
                username: decoded.username,
                role: decoded.role,
            }).select("-password");

            req.roleName = decoded.roleName;

            console.log("User is authenticated".green);

            return next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

export const admin = asyncHandler(async (req, res, next) => {
    console.log("Verifying that user is admin");

    const roleName = req.roleName;

    try {
        if (roleName === "ADMIN") {
            console.log("Verified that user is admin".green);
            next();
        } else {
            console.log("User is not an admin. STEP BACK!".red);
            return res.status(401).send({
                message: "ERR_NOT_AUTHORIZED_NO_ADMIN",
            });
        }
    } catch (error) {
        res.status(401).send({
            message: "ERR_NOT_AUTHORIZED_NO_ADMIN",
            error,
        });
    }
});

export const tutor = asyncHandler(async (req, res, next) => {
    try {
        const roleName = req.roleName;

        if (roleName === "TUTOR") {
            console.log("Verified that user is tutor".green);
            next();
        } else {
            console.log("User is not a tutor".red);
            return res.status(401).send({
                message: "ERR_NOT_AUTHORIZED_NO_TUTOR",
            });
        }
    } catch (error) {
        res.status(401).send({
            message: "ERR_NOT_AUTHORIZED_NO_TUTOR",
            error,
        });
    }
});

export const student = asyncHandler(async (req, res, next) => {
    try {
        console.log("Verifying that user is student".red);

        const roleName = req.roleName;

        if (roleName === "STUDENT") {
            console.log("Verified that user is student".green);
            console.log("req.user");
            console.log(req.user);
            next();
        } else {
            console.log("User is not a student".red);
            return res.status(401).send({
                message: "ERR_NOT_AUTHORIZED_NO_STUDENT",
            });
        }
    } catch (error) {
        res.status(401).send({
            message: "ERR_NOT_AUTHORIZED_NO_STUDENT",
            error,
        });
    }
});

export const hasAccessToAssignment = asyncHandler(async (req, res, next) => {
    console.log("Verifying that user has access to assignment".red);
    try {
        const userId = req.user._id;
        const roleName = req.roleName;
        const assignmentId = req.params.id;

        if (roleName === "TUTOR") {
            const tutorHasAccess = await Assignment.findOne({
                createdBy: userId,
                _id: assignmentId,
            });
            if (tutorHasAccess) {
                console.log(
                    "Verified that user has access to assignment".green
                );
                next();
            } else {
                console.log("User does not have access to assignment".red);
                return res.status(401).send({
                    message: "ERR_NOT_AUTHORIZED_TO_ASSIGNMENT",
                });
            }
        }

        if (roleName === "STUDENT") {
            console.log(
                `User ${userId} is trying to access assignment ${assignmentId}`
            );

            const hasAccess = await Assignment.findOne({
                _id: assignmentId,
                assignedTo: userId,
            });

            if (hasAccess) {
                console.log(
                    "Verified that user has access to assignment".green
                );
                next();
            } else {
                console.log("User does not have access to assignment".red);
                return res.status(401).send({
                    message: "ERR_NOT_AUTHORIZED_TO_ASSIGNMENT",
                });
            }
        }
    } catch (error) {
        return res.status(401).send({
            message: "ERR_NOT_AUTHORIZED_TO_ASSIGNMENT",
            error,
        });
    }
});
