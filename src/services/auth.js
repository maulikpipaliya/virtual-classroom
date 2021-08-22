import jwt from "jsonwebtoken";
import { getRoleFromUserId } from "../models/modelHelpers.js";

//generate JWT Token
const generateAuthToken = async (user) => {
    console.log("Signing JWT");
    const { _id, username } = user;

    let roleName;
    const roleDetails = await getRoleFromUserId(_id);
    if (roleDetails) {
        roleName = roleDetails.roleName;
    }

    try {
        return jwt.sign(
            { _id, username, role: user.role, roleName },
            process.env.JWT_PASSWORD,
            {
                expiresIn: "1d",
            }
        );
    } catch (error) {
        console.error("ERR_GENERATING_TOKEN");
        console.log(error);
    }
};

export default generateAuthToken;
