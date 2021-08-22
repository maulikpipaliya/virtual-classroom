import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import {
    swaggerInfo,
    swaggerConfigPaths,
    swaggerDefinitions,
} from "./swagger.js";

export const setUpSwagger = (app) => {
    app.use(swaggerUI.serve, swaggerUI.setup(app, swaggerJSDoc));

    //Swagger
    const swaggerOptions = {
        swaggerDefinition: {
            info: swaggerInfo,
            paths: swaggerConfigPaths,
            definitions: swaggerDefinitions,
        },
        apis: [
            "src/app.js",
            "src/api/routes/commonRoutes.js",
            "src/api/routes/userRoutes.js",
        ],
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
    };

    //swagger-ui
    const swaggerDocs = swaggerJSDoc(swaggerOptions);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
};
