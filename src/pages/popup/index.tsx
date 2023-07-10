import "@pages/popup/index.css";

import Popup from "@pages/popup/Popup";
import { EntriesProvider } from "@src/contexts/Entries";
import { OptionsProvider } from "@src/contexts/Options";
import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/popup");

function init() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const root = createRoot(appContainer);
  root.render(
    <OptionsProvider>
      <EntriesProvider>
        <Popup />
      </EntriesProvider>
    </OptionsProvider>
  );
}

// if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
//   const background = document.body.style.background;
//   document.body.style.background = "#121212";
//   setTimeout(() => {
//     document.body.style.background = background;
//   }, 500);
// }

init();
