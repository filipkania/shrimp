import express from "express";
import dotenv from "dotenv";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router/app";
import { createLogger } from "./utils/logger";

if (process.env.NODE_ENV === "development") dotenv.config();
const run = async () => {
  const logger = createLogger();
  const app = express();

  app.use("/trpc", createExpressMiddleware({ router: appRouter }));

  app.listen(8080, () => {
    logger.info("Shrimp server is listening on port 8080.");
  });
};

run();
