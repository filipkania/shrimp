import { Type, Static } from "@sinclair/typebox";

export const User = Type.Object({
  id: Type.String(),
  username: Type.String(),
  pubkey: Type.String(),
  keyPairSalt: Type.String(),
  srpVerifier: Type.String(),
  srpSalt: Type.String(),
  srpServerPrivateKey: Type.Optional(Type.String()),
  srpClientPublicKey: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String()),
  updatedAt: Type.String(),
});

export type UserType = Static<typeof User>;
