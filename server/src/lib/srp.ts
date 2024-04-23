import jsrp from "jsrp";

export const srpGenerateKeyPair = async (salt: string, verifier: string) => {
  const srp = new jsrp.server();

  await new Promise((resolve) => {
    srp.init({ salt, verifier }, () => resolve(null));
  });

  return {
    publicKey: srp.getPublicKey(),
    privateKey: srp.getPrivateKey(),
  };
};

export const srpValidateClientProof = async (
  salt: string,
  verifier: string,
  clientPublicKey: string,
  clientProof: string,
  serverPrivateKey: string
) => {
  const srp = new jsrp.server();

  await new Promise((resolve) => {
    srp.init({ b: serverPrivateKey, salt, verifier }, () => resolve(null));
  });
  srp.setClientPublicKey(clientPublicKey);

  return srp.checkClientProof(clientProof);
};
