import pino from "pino";
import type { Env } from "./env";

export const createLogger = ({ env }: { env: Env }) => {
  const settings: pino.LoggerOptions = {
    level: env.PINO_LOG_LEVEL || "info",
  };

  if (env.NODE_ENV === "development") {
    settings.transport = {
      target: "pino-pretty",
    };
  }

  return pino(settings);
};
