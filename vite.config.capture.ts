import { dir } from "console";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

const isDev = process.env.__DEV__ === "true";
const isProduction = !isDev;

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const captureOutDir = resolve(outDir, "src/pages/capture");

const extensionToDelete = ["png", "json"];

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
    outDir: resolve(captureOutDir),
    lib: {
      entry: resolve(pagesDir, "content", "capture.ts"),
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
          fs.unlinkSync(`${captureOutDir}/${dir}`);
          // console.log(`${`${captureOutDir}/${dir}`.split(__dirname + "/")[1]} removed`);
        }
      });
    });
  } catch (err) {
    console.error("Something wrong happened removing the file", err);
  }
};
