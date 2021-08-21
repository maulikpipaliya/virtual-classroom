import express from "express";

import { config } from "./config/index.js";
import userRouter from "./api/routes/userRoutes.js";
import tutorRouter from "./api/routes/tutor/tutorRoutes.js";
import commonRouter from "./api/routes/commonRoutes.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { notFound, errorHandler } from "./api/middlewares/error.js";

//Swagger
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import connectDB from "./config/connectDatabase.js";
import { tutor } from "./api/middlewares/auth.js";
const app = express();

//Swagger
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Virtual Classroom API",
            version: "1.0.0",
            description: "Virtual Classroom API",
            servers: ["http://localhost:3000"],
        },
    },
    apis: ["app.js"],
};

//swagger-ui

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});

connectDB();

app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerJSDoc(swaggerOptions))
);
app.use("/api", commonRouter);

/**
 * @swagger 
 * /users:
 *  get:
 *      description: Get all users
 * 
*/

app.use("/api/users", userRouter);
app.use("/api/tutor", tutorRouter);

app.get("/", (req, res) => {
    res.json({
        message:
            "Welcome to the APIs of Virtual Classroom. Be careful, we'll keep a check on who you are!",
    });
});

//Middlewares
app.use(notFound);
app.use(errorHandler);
