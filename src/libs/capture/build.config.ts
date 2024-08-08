import fs from "fs";
import { defineConfig } from "vite";

import { assetsDir, captureDir, captureOutDir, pagesDir, rootDir } from "../../../utils/paths";
import { rmDirRecursive, rmFile } from "../../../utils/plugins/rm-dir-recursive";

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

const extensionToDelete = ["png", "json", "_locales", "providers"];

export default defineConfig({
  resolve: {
    alias: {
      "@src": rootDir,
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
    outDir: captureOutDir,
    lib: {
      entry: captureDir,
      name: "WebAnsers/capture",
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
    const dirCount = fs.readdirSync(captureOutDir);
    dirCount.forEach((dir) => {
      extensionToDelete.forEach((ext) => {
        if (dir.includes(ext)) {
          if (dir.includes(ext)) {
            if (/\..+$/.test(dir)) {
              rmFile(`${captureOutDir}/${dir}`);
            } else {
              rmDirRecursive(`${captureOutDir}/${dir}`);
            }
            // console.log(`${`${captureOutDir}/${dir}`.split(__dirname + "/")[1]} removed`);
          }
        }
      });
    });
  } catch (err) {
    console.error("Something wrong happened removing the file", err);
  }
};
