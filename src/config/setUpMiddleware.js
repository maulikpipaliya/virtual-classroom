import { notFound, errorHandler } from "../api/middlewares/error.js";

export default (app) => {
    app.use(notFound);
    app.use(errorHandler);
};
