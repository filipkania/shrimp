import pino from "pino";

export const createLogger = () => {
  const settings: pino.LoggerOptions = {
    level: process.env.PINO_LOG_LEVEL || "info",
  };

  if (process.env.NODE_ENV === "development") {
    settings.transport = {
      target: "pino-pretty",
    };
  }

  return pino(settings);
};
