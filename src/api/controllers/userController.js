import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import { allRoles } from "../../models/roleModel.js";

const registerUser = asyncHandler(async (req, res, next) => {
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

const authenticateUser = asyncHandler(async (req, res) => {
    try {
        const userData = req.body;
        const { username, password } = userData;

        console.log("Authenticating user...");
        if (!username || !password) {
            return res.status(400).json({
                message: "Please enter username and password both",
            });
        }

        const existingUser = await User.findOne({ username });
        // console.log("User password: ", existingUser);
        console.log("User password: ", existingUser.password);
        console.log("Form password", password);
        console.log("Form password", typeof existingUser.password);
        console.log("Form password", typeof password);

        if (
            existingUser &&
            String(existingUser.password) === String(password)
        ) {
            console.log("Equal");
            const token = generateAuthToken(existingUser);
            console.log(token);
            res.status(200).json({
                success: true,
                token,
            });
        } else {
            res.status(400).json({
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

const createUser = asyncHandler(async (req, res) => {
    console.log("createUser API called");
    const user = req.body;
    console.log(user);
    user.password = user.password.trim();
    user.username = user.username.trim();

    if (!user.password) {
        return res.status(400).send({
            message: "Password is required",
        });
    }

    if (!user.username) {
        return res.status(400).send({
            message: "Username is required",
        });
    }

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

const getUsers = asyncHandler(async (req, res) => {
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

const getUserByUsername = asyncHandler(async (req, res) => {
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
                message: "User not found",
            });
        }
    } catch (error) {
        res.status(400).send({
            message: error,
        });
    }
});

export {
    registerUser,
    getUsers,
    createUser,
    getUserByUsername,
    authenticateUser,
};
