import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),

  PINO_LOG_LEVEL: z.enum(["info", "debug", "warn", "error"]).optional(),
});

export type Env = z.infer<typeof schema>;

export const parseEnv = async () => {
  const result = await schema.safeParseAsync(process.env);

  if (!result.success) {
    console.error(
      "[ERROR] Invalid environment variables: " +
        JSON.stringify(result.error.format(), null, 4)
    );
    process.exit(1);
  }

  return result.data;
};
