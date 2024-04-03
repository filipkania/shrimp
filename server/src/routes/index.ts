import { type ElysiaApp } from "..";
import { srpGenerateSalt } from "@shrimp/crypto";

export default (app: ElysiaApp) =>
  app.get("/", async ({ logger, requestID }) => {
    logger.info("hello world!", requestID);
    return "hi there!" + (await srpGenerateSalt());
  });
