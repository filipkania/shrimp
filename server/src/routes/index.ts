import Elysia from "elysia";
import { IDMiddleware } from "../utils/requestID";

export default new Elysia()
  .use(IDMiddleware)
  .get("/", ({ logger, requestID }) => {
    logger?.info("hello world!");
    return "hello, world!" + requestID;
  });
