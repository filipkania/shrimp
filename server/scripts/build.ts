import pkg from "../package.json";

const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);

const routesGlob = new Bun.Glob("./src/routes/**/*");
const routes = Array.from(routesGlob.scanSync({ cwd: "./" }));

const result = await Bun.build({
  entrypoints: ["./src/index.ts", ...routes],
  outdir: "./out/",
  root: "./src/",

  external: [...deps, ...devDeps],
  target: "node", // with other targets, bun build inlines all env vars :/

  minify: true,
  splitting: true,

  sourcemap: "external",
});

console.log(result);
if (!result.success) process.exit(1);
