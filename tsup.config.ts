import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  treeshake: true,
  minify: true,
  dts: true,
  sourcemap: true,
  clean: true,
  keepNames: true,
  tsconfig: "tsconfig.build.json",
})
