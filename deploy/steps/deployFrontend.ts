import { spawnSync } from "bun";

export const deployFrontend = async () => {
  spawnSync(["bun", "install"], {
    cwd: "./client",
    stdout: "inherit",
    stderr: "inherit",
  });

  spawnSync(["bun", "run", "build"], {
    cwd: "./client",
    stdout: "inherit",
    stderr: "inherit",
  });

  spawnSync(["wrangler", "pages", "deploy", "out"], {
    cwd: "./client",
    stdout: "inherit",
    stderr: "inherit",
  }); 
}