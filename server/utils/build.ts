import pkg from "../package.json";

const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);

console.log(
  await Bun.build({
    entrypoints: ["./index.ts"],
    outdir: "./out/",
    root: ".",

    external: [...deps, ...devDeps],
    target: "node", // with other targets, bun build inlines all env vars :/

    minify: true,
    splitting: true,

    sourcemap: "external",
  })
);
