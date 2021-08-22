import { setUpRoutes } from "./api/routes/index.js";
import {
    setUpDatabaseConnection,
    setUpExpressServer,
    setUpMiddlewares,
    setUpSwagger,
} from "./config/index.js";

const app = setUpExpressServer();

await setUpDatabaseConnection();

setUpRoutes(app);

setUpSwagger(app);

setUpMiddlewares(app);
