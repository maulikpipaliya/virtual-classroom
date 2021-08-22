import setUpExpressServer from "./expressConfig.js";
import setUpMiddlewares from "./setUpMiddleware.js";
import setUpDatabaseConnection from "./connectDB.js";
import { setUpSwagger } from "./swagger/configSwagger.js";

export const config = {
    port: process.env.PORT || 3000,
    host: "http://localhost:3000",
};

export {
    setUpExpressServer,
    setUpMiddlewares,
    setUpDatabaseConnection,
    setUpSwagger,
};
