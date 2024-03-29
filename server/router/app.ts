import { publicProcedure, router } from "../trpc";

export type ShrimpTRPC = typeof appRouter;

export const appRouter = router({
  greeting: publicProcedure.query(() => "hello from Shrimp!"),
});
