import { type ElysiaApp } from "..";

export default (app: ElysiaApp) =>
  app.get("/", ({ logger, requestID }) => {
    logger.info("hello world!", requestID);
    return "hi there!" + requestID;
  });
