import commonRouter from "./commonRoutes.js";
import tutorRouter from "./tutor/tutorRoutes.js";
import adminRouter from "./adminRoutes.js";
import authRouter from "./authRoutes.js";
import assignmentRouter from "./assignmentRouter.js";
import profileRouter from "./profileRouter.js";
import { config } from "../../config/index.js";
import { setUpSwagger } from "../../config/setup.js";

export const setUpRoutes = (app) => {
    app.get("/", (req, res) => {
        res.status(200).json({
            message:
                "Welcome to the APIs of Virtual Classroom. Be careful, we'll keep a check on who you are!",
        });
    });
    // app.use("/api", commonRouter);
    app.use("/api", profileRouter);
    app.use("/api/assignment", assignmentRouter);
    app.use("/api/users", authRouter);
    // app.use("/api/tutor", tutorRouter);
    app.use("/api/admin", adminRouter);
};
