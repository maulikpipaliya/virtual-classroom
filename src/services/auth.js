import jwt from "jsonwebtoken";

//generate JWT Token
const generateAuthToken = (user) => {
    console.log("Signing JWT");
    const { username } = user;
    try {
        return jwt.sign(
            { username, role: user.role },
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
