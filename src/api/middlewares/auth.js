import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import colors from "colors";
import Role from "../../models/roleModel.js";

export const protect = asyncHandler(async (req, res, next) => {
    console.log("Verifying that user is authenticated");
    let reqAuth = req.headers.authorization;

    let token;

    if (reqAuth && reqAuth.startsWith("Bearer")) {
        try {
            token = reqAuth.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_PASSWORD);

            //does not include password
            req.user = await User.findOne({
                username: decoded.username,
                role: decoded.role,
            }).select("-password");

            console.log("User is authenticated".green);
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
    next();
});

export const admin = asyncHandler(async (req, res, next) => {
    console.log("Verifying that user is admin");

    try {
        const { _id: roleIdOfAdmin } = await Role.findOne({
            roleName: "ADMIN",
        });

        if (req.user.role.equals(roleIdOfAdmin)) {
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
        const { _id: roleIdOfTutor } = await Role.findOne({
            roleName: "TUTOR",
        });

        if (req.user.role.equals(roleIdOfTutor)) {
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
        const { _id: roleIdOfStudent } = await Role.findOne({
            roleName: "STUDENT",
        });
        if (req.user.role.equals(roleIdOfStudent)) {
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

    if (req.role.roleName === "STUDENT") {
        next();
    }
    return res.status(401).send("Not authorized, not a student");
});
