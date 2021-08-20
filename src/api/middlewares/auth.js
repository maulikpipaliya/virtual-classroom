import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
    console.log("In protect middleware");
    let reqAuth = req.headers.authorization;

    let token;

    if (reqAuth && reqAuth.startsWith("Bearer")) {
        try {
            token = reqAuth.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
            console.log(decoded);

            //does not include password
            req.user = await User.find({ username: decoded.username }).select(
                "-password"
            );
            next();
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

const tutor = asyncHandler(async (req, res, next) => {
    if (req.role.roleName === "TUTOR") {
        next();
    }
    return res.status(401).send("Not authorized, not a tutor");
});

const student = asyncHandler(async (req, res, next) => {
    if (req.role.roleName === "STUDENT") {
        next();
    }
    return res.status(401).send("Not authorized, not a student");
});

export { protect, tutor, student };
