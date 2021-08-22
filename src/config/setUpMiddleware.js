import { notFound, errorHandler } from "../api/middlewares/error.js";
import { setUpSwagger } from "./swagger/configSwagger.js";

export default (app) => {
    app.use(notFound);
    app.use(errorHandler);

    app.use("*", (req, res) => {
        res.status(404).send("Not found");
    });
};
