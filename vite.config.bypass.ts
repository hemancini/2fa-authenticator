import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

import { rmDirRecursive, rmFile } from "./utils/plugins/rm-dir-recursive";

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const bypassOutDir = resolve(outDir, "src/pages/bypass");

const extensionToDelete = ["png", "json", "_locales"];

export default defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@pages": pagesDir,
      "@assets": assetsDir,
    },
  },
  plugins: [
    {
      name: "postbuild",
      closeBundle: async () => {
        await postBuild(); // run during closeBundle hook. https://rollupjs.org/guide/en/#closebundle
      },
    },
  ],
  build: {
    minify: isProduction,
    cssCodeSplit: false,
    emptyOutDir: true,
    outDir: resolve(bypassOutDir),
    lib: {
      entry: resolve(pagesDir, "content", "bypass.ts"),
      name: "WebAnsers/bypass",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        extend: true,
      },
    },
  },
});

const postBuild = async () => {
  try {
    const dirCount = fs.readdirSync(bypassOutDir);
    dirCount.forEach((dir) => {
      extensionToDelete.forEach((ext) => {
        if (dir.includes(ext)) {
          if (/\..+$/.test(dir)) {
            rmFile(`${bypassOutDir}/${dir}`);
          } else {
            rmDirRecursive(`${bypassOutDir}/${dir}`);
          }
          // console.log(`${`${bypassOutDir}/${dir}`.split(__dirname + "/")[1]} removed`);
        }
      });
    });
  } catch (err) {
    console.log("Something wrong happened removing the file", err);
  }
};
