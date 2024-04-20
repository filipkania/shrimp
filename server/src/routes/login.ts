import { Elysia, t } from "elysia";
import { IDMiddleware } from "../utils/requestID";
import { UserInput } from "../../prisma/typebox";
import { prisma } from "../utils/prisma";

export default new Elysia({ prefix: "/auth" })
  .use(IDMiddleware)
  .post(
    "/register",
    async ({ body, error }) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: body.username.toLowerCase(),
        },
        select: { id: true },
      });

      if (existingUser) {
        return error(409, "User already exists.");
      }

      return await prisma.user.create({
        data: {
          ...body,
          username: body.username.toLowerCase(),
        },
      });
    },
    {
      body: t.Omit(UserInput, ["id", "createdAt", "updatedAt"]),
    }
  )
  .get("/something", () => "test");
