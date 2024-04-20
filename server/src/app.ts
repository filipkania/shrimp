import Elysia from "elysia";

import indexRoutes from "./routes/index";

export const app = new Elysia().use(indexRoutes);
