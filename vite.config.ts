import { spawn } from "node:child_process";

import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import { defineConfig } from "vite";

import manifest from "./manifest";
import packageJson from "./package.json";
import {
  assetsDir,
  componentsDir,
  definitionsDir,
  outDir,
  pagesDir,
  publicDir,
  rootDir,
  routesDir,
} from "./utils/paths";
import addHmr from "./utils/plugins/add-hmr";
import customDynamicImport from "./utils/plugins/custom-dynamic-import";
import makeManifest from "./utils/plugins/make-manifest";

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = true;

const devPages = {
  devtools: resolve(pagesDir, "devtools", "index.html"),
  panel: resolve(pagesDir, "panel", "index.html"),
};

export default defineConfig({
  resolve: {
    alias: {
      "@src": rootDir,
      "@assets": assetsDir,
      "@pages": pagesDir,
      "@routes": routesDir,
      "@components": componentsDir,
      "@definitions": definitionsDir,
    },
  },
  plugins: [
    react(),
    makeManifest(manifest, {
      isDev,
      contentScriptCssKey: regenerateCacheInvalidationKey(),
    }),
    customDynamicImport(),
    addHmr({ background: enableHmrInBackgroundScript, view: true }),
    {
      name: "postbuild",
      closeBundle: async () => {
        buildCloseBundle("src/libs/autofill/build.config.ts");
        buildCloseBundle("src/libs/bypass/build.config.ts");
        buildCloseBundle("src/libs/capture/build.config.ts");
      },
    },
  ],
  define: {
    APP_VERSION: packageJson.version,
  },
  publicDir,
  build: {
    outDir,
    /** Can slowDown build speed. */
    // sourcemap: isDev,
    minify: isProduction,
    reportCompressedSize: isProduction,
    rollupOptions: {
      input: {
        ...(isDev ? devPages : {}),
        content: resolve(pagesDir, "content", "index.ts"),
        background: resolve(pagesDir, "background", "index.ts"),
        contentStyle: resolve(pagesDir, "content", "style.scss"),
        popup: resolve(pagesDir, "popup", "index.html"),
        options: resolve(pagesDir, "options", "index.html"),
        sidePanel: resolve(pagesDir, "sidePanel", "index.html"),
        captureCSS: resolve(rootDir, "libs", "capture", "style.scss"),
      },
      watch: {
        include: ["src/**", "vite.config.ts"],
        exclude: ["node_modules/**", "src/**/*.spec.ts"],
      },
      output: {
        entryFileNames: "src/pages/[name]/index.js",
        chunkFileNames: isDev ? "assets/js/[name].js" : "assets/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const { dir, name: _name } = path.parse(assetInfo.name);
          const assetFolder = dir.split("/").at(-1);
          const name = assetFolder + firstUpperCase(_name);
          if (name === "contentStyle") {
            return `assets/css/contentStyle${cacheInvalidationKey}.chunk.css`;
          }
          return `assets/[ext]/${name}.chunk.[ext]`;
        },
      },
    },
  },
});

function firstUpperCase(str: string) {
  const firstAlphabet = new RegExp(/( |^)[a-z]/, "g");
  return str.toLowerCase().replace(firstAlphabet, (L) => L.toUpperCase());
}

let cacheInvalidationKey: string = generateKey();
function regenerateCacheInvalidationKey() {
  cacheInvalidationKey = generateKey();
  return cacheInvalidationKey;
}

function generateKey(): string {
  return `${(Date.now() / 100).toFixed()}`;
}

function buildCloseBundle(
  viteConfig:
    | "src/libs/capture/build.config.ts"
    | "src/libs/bypass/build.config.ts"
    | "src/libs/autofill/build.config.ts"
) {
  const build = spawn("vite", ["build", "--config", viteConfig]);
  build.stderr.on("data", (data) => {
    console.error(`${data}`.split("\n").join(""));
  });
  build.stdout.on("data", (data) => {
    console.log(`${data}`.split("\n").join(""));
  });
}
