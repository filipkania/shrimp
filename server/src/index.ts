import { app } from "./app";
import { logger } from "./utils/logger";

export type ElysiaApp = typeof app;

const run = async () => {
  app.listen(process.env.PORT || 8080, () => {
    logger.info(`🍤 Shrimp server is running on port ${app.server?.port}.`);
  });
};

run();
