import asyncHandler from "express-async-handler";
import generateAuthToken from "../../services/auth.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";

export const signIn = asyncHandler(async (req, res) => {
    console.log("Someone is trying to signin");

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

            console.log("token");
            console.log(token);

            const { roleName } = await Role.findById(existingUser.role);
            console.log(
                `${existingUser.username} has signed in and role is ${roleName}`
            );

            res.status(200).json({
                success: true,
                token,
                roleName,
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
