import packageJson from "./package.json";

// const isDev = process.env.__DEV__ === "true";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "__MSG_extensionName__",
  default_locale: "es",
  version: packageJson.version,
  description: "__MSG_extensionDescription__",
  homepage_url: packageJson.repository.url,
  // options_page: "src/pages/options/index.html",
  permissions: ["tabs", "activeTab", "storage", "scripting", "sidePanel" as any],
  side_panel: {
    default_path: "src/pages/sidePanel/index.html",
  },
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34-dev.png",
    // default_icon: isDev ? "icon-34-dev.png" : "icon-34.png",
  },
  commands: {
    "scan-qr": {
      suggested_key: {
        default: "Ctrl+Shift+P",
        mac: "Command+Shift+P",
      },
      description: "Scan a QR code",
    },
  },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["https://*.us.trustedauth.com/*"],
      js: ["src/libs/bypass/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  optional_host_permissions: ["*://*/*"],
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "icon-128.png", "icon-34.png", "icon-34-dev.png"],
      matches: ["*://*/*"],
    },
  ],
};

export default manifest;
