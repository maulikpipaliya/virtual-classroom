import jwt from "jsonwebtoken";

//generate JWT Token
const generateAuthToken = (user) => {
    console.log("Signing JWT");
    const { username } = user;
    try {
        return jwt.sign({ username }, process.env.JWT_PASSWORD, {
            expiresIn: "1m",
        });
    } catch (error) {
        console.log("Error in generating AuthToken");
        console.log(error);
    }
};

export default generateAuthToken;
