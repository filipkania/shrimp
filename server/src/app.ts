import Elysia from "elysia";
import { randomUUID } from "crypto";
import { createLogger } from "./utils/logger";
import { autoroutes } from "elysia-autoroutes";
import { PrismaClient } from "@prisma/client";

export const app = new Elysia()
  .decorate({
    logger: createLogger(),
    prisma: new PrismaClient({
      log:
        process.env.NODE_ENV !== "production"
          ? ["query", "info", "warn", "error"]
          : [],
    }),
  })
  .derive(({ set, logger }) => {
    // elysia calles derive function twice :/
    if (!set.headers["X-Request-ID"]) {
      const requestID = randomUUID();
      set.headers["X-Request-ID"] = requestID;

      return {
        logger: logger.child({ requestID }),
        requestID,
      };
    }

    return {};
  })
  .use(
    autoroutes({
      routesDir: "./routes",
    })
  );
