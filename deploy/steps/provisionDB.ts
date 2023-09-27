import { green, yellow, bold } from "picocolors";
import { runCmdSync } from "../runCmd";

type WranglerDB = {
	uuid: string;
	name: string;
	version: string;
	created_at: string;
};

export const provisionDB = () => {
	console.log(green(bold("- Provisioning D1 database...")));

	const { stdout } = runCmdSync(["wrangler", "d1", "list", "--json"]);
	const dbs: WranglerDB[] = JSON.parse(stdout.toString());

	if (dbs.some((db) => db.name === "shrimp-db")) {
		console.info(yellow("Seems like there's already an existing `shrimp-db` database. Skipping DB creation..."));
		return;
	}

	runCmdSync(["wrangler", "d1", "create", "shrimp-db"], {
		stdout: "inherit",
		stderr: "inherit",
	});

	// TODO: save DB UUID to wrangler.toml
};
