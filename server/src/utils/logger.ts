import pino from "pino";

export const createLogger = () => {
  const options: pino.LoggerOptions = {
    level: process.env.NODE_ENV !== "production" ? "debug" : "info",
  };

  if (process.env.NODE_ENV !== "production") {
    options.transport = {
      target: "pino-pretty",
    };
  }

  return pino(options);
};

export const logger = createLogger();
