import { publicProcedure, router } from "../trpc";

export type ShrimpTRPC = typeof appRouter;

export const appRouter = router({
  greeting: publicProcedure.query(() => "hello from woow!"),

  getUsers: publicProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.user.findMany();
  }),

  insertUser: publicProcedure.query(async ({ ctx: { prisma } }) => {
    await prisma.user.create({
      data: {
        name: "hello",
      },
    });
    return { result: "created" };
  }),
});
