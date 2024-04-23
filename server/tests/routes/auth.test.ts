import { describe, it, expect } from "bun:test";

import { treaty } from "@elysiajs/eden";
import authRouter from "@/routes/auth";
import jsrp from "jsrp";

describe("auth routes", async () => {
  const api = treaty(authRouter);

  const username = "test_" + Date.now();

  const clientSrp = new jsrp.client();
  const verifier: jsrp.Verifier = await new Promise((resolve) => {
    clientSrp.init({ username, password: username }, () => {
      clientSrp.createVerifier((_, result) => {
        resolve(result);
      });
    });
  });

  it("should register a user", async () => {
    const user = {
      username,
      keyPairSalt: "A".repeat(16),
      pubkey: "A".repeat(32),
      srpVerifier: verifier.verifier,
      srpSalt: verifier.salt,
    };

    const resp = await api.auth.register.post(user);
    expect(resp.status).toBe(200);
    expect(resp.data?.username).toEqual(username);
  });

  it("should return salt + pubkey", async () => {
    const resp = await api.auth.salt.post({
      username,
      clientPublicKey: clientSrp.getPublicKey(),
    });

    expect(resp.status).toBe(200);
    expect(resp.data).toEqual({
      serverSrpPubKey: expect.any(String),
      salt: verifier.salt,
    });

    if (!resp.data) {
      throw new Error("Missing data");
    }

    clientSrp.setSalt(resp.data.salt);
    clientSrp.setServerPublicKey(resp.data.serverSrpPubKey);
  });

  it("should successfully authenticate", async () => {
    const clientProof = clientSrp.getProof();

    const resp = await api.auth.login.post({
      username,
      clientProof,
    });

    expect(resp.status).toBe(200);
    expect(resp.data).toEqual({ success: true });
  });
});
