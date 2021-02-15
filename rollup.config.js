import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const name = require("./package.json").main.replace(/\.js$/, "");

const bundle = (config) => ({
  ...config,
  input: ["src/index.ts", "src/date.ts", "src/datetime.ts", "src/time.ts"],
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
      },
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "[name].mjs",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: [
      {
        dir: "dist",
        format: "esm",
      },
    ],
  }),
];
