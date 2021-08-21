import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import { allRoles } from "../../models/roleModel.js";

export const registerUser = asyncHandler(async (req, res, next) => {
    //register a user
    const { username, password, roleName } = req.body;

    //checking if username already exists
    const user = await User.findOne({ username });
    if (user) {
        res.status(400).json({
            message: "Username already exists",
        });
    } else {
        if (!roleName || !password) {
            res.status(400).json({
                message: "Please provide roleName and password both",
            });
        } else {
            //get Role ObjID from roleName

            //if roleName valid
            console.log(allRoles);
            if (allRoles.includes(roleName.toUpperCase())) {
                const roleObj = await Role.findOne({
                    roleName: roleName.toUpperCase(),
                });

                //create user
                const newUser = await User.create({
                    username,
                    password,
                    role: roleObj._id,
                });
                res.status(201).json({
                    message: "User created successfully",
                    data: newUser,
                });
            } else {
                res.status(400).json({
                    message: "Role does not exist",
                });
            }
        }
    }
});

export const signIn = asyncHandler(async (req, res) => {
    try {
        const userData = req.body;
        const { username, password } = userData;

        console.log("User signing in ...");
        if (!username || !password) {
            return res.status(400).json({
                message: "Please enter username and password both",
            });
        }

        const existingUser = await User.findOne({ username });
        // console.log(userData);

        if (!existingUser) {
            return res.status(400).json({
                message: "ERR_INVALID_CREDENTIALS",
            });
        }

        if (existingUser && (await existingUser.matchPassword(password))) {
            console.log("Equal");
            const token = generateAuthToken(existingUser);

            const { roleName } = await Role.findById(existingUser.role);
            console.log(
                `${existingUser.username} has signed in and role is ${roleName}`
            );

            res.status(200).json({
                success: true,
                token,
            });
        } else {
            res.status(400).json({
                message: "ERR_INVALID_PASSWORD",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

//ADMIN : create User
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

export const getUsers = asyncHandler(async (req, res) => {
    console.log("getUsers API called");
    const userID = req.user;
    console.log("userID");
    console.log(userID);
    try {
        const users = await User.find();
        res.json({
            message: "Users have been fetched",
            data: users,
        });
    } catch (error) {
        res.status(400).send({
            message: error,
        });
    }
});

export const getUserByUsername = asyncHandler(async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username });

        if (user) {
            res.json({
                message: "User has been fetched",
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

//update password for a user
export const updatePassword = asyncHandler(async (req, res) => {
    console.log("updatePassword API called");
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Please enter username and password both",
        });
    }

    try {
        const user = await User.findOne({ username });
        if (user) {
            user.password = password;
            await user.save();
            res.json({
                message: "Password updated successfully",
            });
        } else {
            res.status(400).json({
                message: "ERR_USER_NOT_FOUND",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
});
