import { runCmdSync } from "../runCmd";

export const deployBackend = async () => {
	runCmdSync(["wrangler", "deploy"], {
		stdout: "inherit",
		stderr: "inherit",
		env: { ...Bun.env, NO_D1_WARNING: "true" },
	});

	// 4. generate random JWT_SECRET
	const random = crypto.getRandomValues(new Uint8Array(64));
	const randomb64 = Buffer.from(random).toString("base64");

	runCmdSync(["wrangler", "secret", "put", "JWT_SECRET"], {
		stdin: Buffer.from(randomb64),
		stdout: "inherit",
	});
};
