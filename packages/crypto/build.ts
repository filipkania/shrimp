import dts from "bun-plugin-dts";

await Bun.build({
	entrypoints: ["./index.ts"],
	outdir: "./out/",

	minify: true,

	plugins: [dts()],
});
