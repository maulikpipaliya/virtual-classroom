import setUpExpressServer from "./expressConfig.js";
import setUpMiddlewares from "./setUpMiddleware.js";
import setUpDatabaseConnection from "./connectDB.js";
import { setUpSwagger } from "./swagger/configSwagger.js";

export {
    setUpExpressServer,
    setUpMiddlewares,
    setUpDatabaseConnection,
    setUpSwagger,
};
