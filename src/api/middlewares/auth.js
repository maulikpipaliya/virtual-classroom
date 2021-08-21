import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import colors from "colors";
import Role from "../../models/roleModel.js";
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

    try {
        const roleDetails = await getRoleFromUserId(req.user._id);

        if (roleDetails && roleDetails.roleName === "ADMIN") {
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
        const roleDetails = await getRoleFromUserId(req.user._id);
        if (roleDetails && roleDetails.roleName === "TUTOR") {
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
            message: "ERR_NOT_AUTHORIZED_NO_STUDENT",
            error,
        });
    }
});

export const student = asyncHandler(async (req, res, next) => {
    try {
        console.log("Verifying that user is student".red);
        const roleDetails = await getRoleFromUserId(req.user._id);

        if (roleDetails && roleDetails.roleName === "STUDENT") {
            console.log("Verified that user is student".green);
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
