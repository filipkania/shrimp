import express from "express";
import dotenv from "dotenv";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router/_app";
import { createLogger } from "./utils/logger";
import { parseEnv } from "./utils/env";
import { PrismaClient } from "@prisma/client";
import { createContext } from "./trpc";
import { createPrismaClient } from "./utils/prisma";

if (process.env.NODE_ENV === "development") dotenv.config();
const run = async () => {
  const env = await parseEnv();
  const logger = createLogger({ env });
  const prisma = createPrismaClient({ env });

  const app = express();

  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: createContext({ prisma, env, logger }),
    })
  );

  ["SIGTERM", "SIGINT"].forEach((sig) =>
    process.on(sig, async () => {
      logger.info("Shutting down...");

      await prisma.$disconnect();
      process.exit(0);
    })
  );

  app.listen(8080, () => {
    logger.info("Shrimp server is listening on port 8080.");
  });
};

run();
