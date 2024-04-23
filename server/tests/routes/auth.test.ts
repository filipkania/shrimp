import { describe, it, expect } from "bun:test";

import { treaty } from "@elysiajs/eden";
import authRouter from "@/routes/auth";
import { prisma } from "@/src/utils/prisma";

describe("auth routes", () => {
  const api = treaty(authRouter);

  it("should register a user", async () => {
    const user = {
      username: "test_" + Date.now(),
      keyPairSalt: "A".repeat(16),
      pubkey: "A".repeat(32),
      srpVerifier: "B".repeat(1024),
      srpSalt: "C".repeat(64),
    };

    const resp = await api.auth.register.post(user);
    expect(resp.status).toBe(200);
    expect(resp.data).toEqual({
      ...user,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    await prisma.user.delete({
      where: {
        id: resp.data?.id,
      },
    });
  });

  it("should return 'test' for /something", async () => {
    // test goes here
  });
});
