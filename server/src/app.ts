import Elysia from "elysia";

import indexRoutes from "./routes/index";
import authRoutes from "./routes/auth";

export const app = new Elysia().use(indexRoutes).use(authRoutes);
