import { setUpRoutes } from "./api/routes/index.js";
import {
    setUpDatabaseConnection,
    setUpExpressServer,
    setUpMiddlewares,
    setUpSwagger,
} from "./config/setup.js";

const app = setUpExpressServer();

setUpRoutes(app);

await setUpDatabaseConnection();

// setUpSwagger(app);
setUpMiddlewares(app);
