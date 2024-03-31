import { PrismaClient } from "@prisma/client";
import type { Env } from "./env";

export const createPrismaClient = ({ env }: { env: Env }) => {
  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn", "info"] : [],
  });
};
