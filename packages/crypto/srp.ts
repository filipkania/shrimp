import srpClient from "secure-remote-password/client";
import srpServer from "secure-remote-password/server";

export const srpGenerateSalt = async () => {
	return srpClient.generateSalt();
};
