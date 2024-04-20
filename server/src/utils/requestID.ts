import Elysia from "elysia";
import { logger } from "./logger";
import { randomUUID } from "crypto";

export const IDMiddleware = new Elysia({ name: "request-id" }).derive(
  { as: "global" },
  ({ set }) => {
    // elysia calls derive function twice :/
    if (!set.headers["X-Request-ID"]) {
      const requestID = randomUUID();
      set.headers["X-Request-ID"] = requestID;

      return {
        logger: logger.child({ requestID }),
        requestID,
      };
    }

    return {};
  }
);
