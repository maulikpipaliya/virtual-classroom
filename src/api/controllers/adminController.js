import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import { allRoles } from "../../models/roleModel.js";

//Admin create a new user
export const createUser = asyncHandler(async (req, res) => {
    console.log("createUser API called");
    const user = req.body;
    console.log(user);

    if (!user.username || !user.password || !user.role) {
        return res.status(400).send({
            message: "Username, password and role details are required",
        });
    }

    user.password = user.password.trim();
    user.username = user.username.trim();
    user.role = user.role.trim().toUpperCase();

    if (!allRoles.includes(user.role)) {
        return res.status(400).send({
            message: "Role does not exist. Valid roles: ['STUDENT','TUTOR']",
        });
    }

    const { _id: roleId } = await Role.findOne({ roleName: user.role });
    user.role = roleId;

    try {
        const userCreated = await User.create(user);
        console.log("userCreated");
        res.status(201).send(userCreated);
    } catch (error) {
        console.log(error);

        console.log(error.message);
        if (
            error.name === "MongoError" &&
            error.code === 11000 &&
            error.keyPattern.username === 1
        ) {
            return res.status(409).send({
                message: `Username ${error.keyValue.username} already exists`,
            });
        }
        return res.status(400).send({
            message: error,
        });
    }
});

//ADMIN : get users

export const getUsers = asyncHandler(async (req, res) => {
    console.log("getUsers API called");
    const userID = req.user;
    console.log("userID");
    console.log(userID);
    try {
        const users = await User.find();
        if (users) {
            res.status(200).json({
                message: "Users have been fetched",
                data: { users },
            });
        } else {
            res.status(404).send({
                message: "No users found",
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error,
        });
    }
});

export const getUserByNameOrId = asyncHandler(async (req, res) => {
    console.log("getUserByNameOrId API called");

    const usernameOrId = req.params.usernameOrId;
    try {
        //check if username or id

        console.log(req.params);
        console.log("usernameOrId");
        console.log(usernameOrId);

        console.log(mongoose.Types.ObjectId.isValid(usernameOrId));
        console.log(mongoose.isValidObjectId(usernameOrId));
        let user;
        if (mongoose.isValidObjectId(usernameOrId)) {
            console.log("id");
            user = await User.findById(usernameOrId);
        } else {
            console.log("usernameOrId is not an id");
            user = await User.findOne({ username: usernameOrId });
        }
        if (user) {
            res.status(200).json({
                message: "User fetched successfully",
                data: user,
            });
        } else {
            res.status(404).send({
                message: "ERR_USER_NOT_FOUND",
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error,
        });
    }
});
