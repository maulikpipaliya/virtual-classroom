import express from "express";

import cors from "cors";
import bodyParser from "body-parser";
import { config } from "../config/index.js";
import dotenv from "dotenv";

export default () => {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    dotenv.config();

    app.listen(config.port, () => {
        console.log(`Server listening on port ${config.port}`);
    });
    return app;
};
