import commonRouter from "./commonRoutes.js";
import tutorRouter from "./tutor/tutorRoutes.js";
import userRouter from "./userRoutes.js";
import adminRouter from "./adminRoutes.js";

export const setUpRoutes = (app) => {
    app.use("/api", commonRouter);
    app.use("/api/users", userRouter);
    app.use("/api/tutor", tutorRouter);
    app.use("/api/admin", adminRouter);

    app.get("/", (req, res) => {
        res.json({
            message:
                "Welcome to the APIs of Virtual Classroom. Be careful, we'll keep a check on who you are!",
        });
    });
};
