import Elysia from "elysia";

import indexRoutes from "./routes/index";
import loginRoutes from "./routes/login";

export const app = new Elysia().use(indexRoutes).use(loginRoutes);
