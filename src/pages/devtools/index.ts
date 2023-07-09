import { t } from "@src/chrome/i18n";

try {
  chrome.devtools.panels.create(t("extensionName"), "icon-34.png", "src/pages/panel/index.html");
} catch (e) {
  console.error(e);
}
