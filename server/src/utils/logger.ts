import pino from "pino";

export const createLogger = () => {
  const options: pino.LoggerOptions = {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
  };

  if (process.env.NODE_ENV === "development") {
    options.transport = {
      target: "pino-pretty",
    };
  }

  return pino(options);
};
