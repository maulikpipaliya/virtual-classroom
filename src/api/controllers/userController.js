import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";
import { allRoles } from "../../models/roleModel.js";
import mongoose from "mongoose";

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
            res.status(200).json({
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
