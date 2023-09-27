import { SpawnOptions } from "bun";
import { bold, white } from "picocolors";

export const runCmdSync = (cmds: string[], options?: SpawnOptions.OptionsObject) => {
  const proc = Bun.spawnSync(cmds, options);

  if (!proc.success) {
    console.error(bold("\nError occured while deploying Shrimp..."));
    console.error(`If you think, this is an issue with Shrimp, please report it at: ${white("https://github.com/filipkania/shrimp/issues/new")}`);
    process.exit(1);
  }

  return proc;
}