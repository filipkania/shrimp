import { initTRPC } from "@trpc/server";
import type { createLogger } from "./utils/logger";
import type { Env } from "./utils/env";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { createPrismaClient } from "./utils/prisma";

export const createContext = ({
  logger,
  env,
  prisma,
}: {
  logger: ReturnType<typeof createLogger>;
  env: Env;
  prisma: ReturnType<typeof createPrismaClient>;
}) => {
  return ({ req, res }: CreateExpressContextOptions) => {
    return {
      logger,
      env,
      prisma,

      req,
      res,
    };
  };
};

type Context = ReturnType<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter: ({ ctx, shape }) => {
    ctx?.logger.error(shape);

    return {
      ...shape,
      message: shape.message.trim(),
      data: {
        ...shape.data,
        stack: undefined,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
