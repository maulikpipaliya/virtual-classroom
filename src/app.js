import express from "express";

import { config } from "./config/index.js";
import userRouter from "./api/routes/userRoutes.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { notFound, errorHandler } from "./api/middlewares/error.js";

import connectDB from "./config/connectDatabase.js";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});

connectDB();

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Hello World!",
    });
});

//Middlewares
app.use(notFound);
app.use(errorHandler);
