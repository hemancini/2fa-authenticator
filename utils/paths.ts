import { resolve } from "node:path";

export const {
  rootDir,
  outDir,
  pagesDir,
  assetsDir,
  bypassOutDir,
  autofillOutDir,
  captureOutDir,
  routesDir,
  componentsDir,
  definitionsDir,
  publicDir,
} = {
  rootDir: resolve("src"),
  outDir: resolve("dist"),
  pagesDir: resolve("src", "pages"),
  assetsDir: resolve("src", "assets"),
  bypassOutDir: resolve("dist", "src", "pages", "bypass"),
  autofillOutDir: resolve("dist", "src", "pages", "autofill"),
  captureOutDir: resolve("dist", "src", "pages", "capture"),
  routesDir: resolve("src", "routes"),
  componentsDir: resolve("src", "components"),
  definitionsDir: resolve("src", "definitions"),
  publicDir: resolve("public"),
} as const;
