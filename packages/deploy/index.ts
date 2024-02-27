import { white, bold, green } from "picocolors";
import { provisionDB } from "./steps/provisionDB";
import { runCmdSync } from "./runCmd";
import prompts from "prompts";
import { type Answers, questions } from "./questions";
import { deployFrontend } from "./steps/deployFrontend";
import { deployBackend } from "./steps/deployBackend";

// TODO: rewrite this whole mess using Cloudflare's API

process.on("SIGINT", () => {
	console.error("Exiting...");
	process.exit(0);
});

(async () => {
	if (typeof Bun === "undefined") {
		console.error(bold("This deployment tool uses Bun's global API, therefore can be only used with Bun."));
		console.error(`You can install Bun from: ${white("https://bun.sh/")}`);

		process.exit(1);
	}

	// check if wrangler is installed
	if (!Bun.which("wrangler")) {
		console.error(bold("Wrangler must be installed system-widely."));
		console.error(`You can install Wrangler globally using: ${white("bun add -g wrangler")}`);

		process.exit(1);
	}

	const answers = (await prompts(questions, {
		onCancel: () => {
			console.error("Exiting...");
			process.exit(0);
		},
	})) as Answers;

	const { stdout: whoamiOutput } = runCmdSync(["wrangler", "whoami"]);
	if (whoamiOutput.toString().includes("You are not authenticated.")) {
		runCmdSync(["wrangler", "login"], {
			stdout: "inherit",
		});
	}

	// 1. provision D1 database
	const d1UUID = provisionDB();

	const wranglerFile = Bun.file("./wrangler.toml");
	if (!(await wranglerFile.exists())) {
		const example = Bun.file("./wrangler.example.toml");

		await Bun.write(wranglerFile, (await example.text()).replace("<YOUR_DB_ID>", d1UUID ?? ""));
	}

	// 2. run migrations
	console.log(green(bold("- Running migrations...")));

	runCmdSync(["wrangler", "d1", "migrations", "apply", "shrimp-db"], {
		stdout: "inherit",
		stderr: "inherit",
		env: { ...Bun.env, NO_D1_WARNING: "true" },
	});

	// 3. deploy backend
	console.log(green(bold("- Deploying backend...")));
  await deployBackend();

  if (answers.frontend) {
    console.log(green(bold(`- Deploying frontend under ${answers.domain}...`)));
    await deployFrontend();
  }
})();
