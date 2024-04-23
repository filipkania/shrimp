import { Elysia, t } from "elysia";
import { IDMiddleware } from "../utils/requestID";
import { User } from "../../prisma/typebox";
import { prisma } from "../utils/prisma";
import { srpGenerateKeyPair, srpValidateClientProof } from "../lib/srp";

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
      body: t.Omit(User, ["id", "createdAt", "updatedAt"]),
    }
  )
  .post(
    "/salt",
    async ({ body, error }) => {
      const user = await prisma.user.findFirst({
        where: {
          username: body.username.toLowerCase(),
        },
        select: { id: true, srpSalt: true, srpVerifier: true },
      });

      if (!user) {
        return error(404, "User not found.");
      }

      const keyPair = await srpGenerateKeyPair(user.srpSalt, user.srpVerifier);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          srpServerPrivateKey: keyPair.privateKey,
          srpClientPublicKey: body.clientPublicKey,
        },
      });

      return { serverSrpPubKey: keyPair.publicKey, salt: user.srpSalt };
    },
    {
      body: t.Object({
        username: t.String(),
        clientPublicKey: t.String(),
      }),
    }
  )
  .post(
    "/login",
    async ({ body, error }) => {
      const user = await prisma.user.findFirst({
        where: {
          username: body.username.toLowerCase(),
        },
        select: {
          id: true,
          srpSalt: true,
          srpVerifier: true,
          srpServerPrivateKey: true,
          srpClientPublicKey: true,
        },
      });

      if (!user || !user.srpClientPublicKey || !user.srpServerPrivateKey) {
        return error(404, "User not found.");
      }

      const success = await srpValidateClientProof(
        user.srpSalt,
        user.srpVerifier,
        user.srpClientPublicKey,
        body.clientProof,
        user.srpServerPrivateKey
      );

      return { success };
    },
    {
      body: t.Object({
        username: t.String(),
        clientProof: t.String(),
      }),
    }
  );
