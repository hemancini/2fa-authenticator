import * as fs from "fs";
import * as path from "path";
import type { PluginOption } from "vite";

import colorLog from "../log";
import ManifestParser from "../manifest-parser";

const { resolve } = path;
const distDir = resolve(__dirname, "..", "..", "dist");
const publicDir = resolve(__dirname, "..", "..", "public");

const oAuth2Enabled = false; // <-- Google OAuth2 Intenty API oAuth2Enabled flag

export default function makeManifest(
  manifest: chrome.runtime.ManifestV3,
  config: { isDev: boolean; contentScriptCssKey?: string }
): PluginOption {
  function makeManifest(to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, "manifest.json");

    // Naming change for cache invalidation
    if (config.contentScriptCssKey) {
      manifest.content_scripts.forEach((script) => {
        script.css = script.css.map((css) => css.replace("<KEY>", config.contentScriptCssKey));
      });
    }

    if (config.isDev) {
      manifest.name = !manifest.name.includes("dev") ? `${manifest.name} (dev)` : manifest.name;
      manifest.action.default_icon = "icon-34-dev.png";
      manifest.web_accessible_resources = [
        {
          ...manifest.web_accessible_resources[0],
          resources: [...manifest.web_accessible_resources[0].resources, "icon-34-dev.png"],
        },
      ];
      if (oAuth2Enabled) {
        manifest.permissions.push("identity");
        manifest.key = import.meta.env.VITE_GOOGLE_OAUTH2_EXT_KEY;
        manifest.oauth2 = {
          client_id: import.meta.env.VITE_GOOGLE_OAUTH2_EXT_ID,
          scopes: ["https://www.googleapis.com/auth/drive.appdata"],
        };
      }
    } else {
      delete manifest.devtools_page;
    }

    fs.writeFileSync(manifestPath, ManifestParser.convertManifestToString(manifest));

    colorLog(`Manifest file copy complete: ${manifestPath}`, "success");
  }

  return {
    name: "make-manifest",
    buildStart() {
      if (config.isDev) {
        makeManifest(distDir);
      }
    },
    buildEnd() {
      if (config.isDev) {
        return;
      }
      makeManifest(publicDir);
    },
  };
}
