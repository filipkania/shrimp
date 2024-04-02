import { app } from "./app";

export type ElysiaApp = typeof app;

const run = async () => {
  app.listen(process.env.PORT || 8080, () => {
    app.decorator.logger.info(
      `Shrimp server is running on port ${app.server?.port}.`
    );
  });
};

run();
