import "@pages/popup/Popup.css";

import Entries from "@routes/Entries";
import { t } from "@src/chrome/i18n";
import Options from "@src/routes/Options";
import { Redirect, Route, Switch } from "wouter";

export default function RoutesPopup() {
  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  if (isPopup) {
    document.title = t("extensionName");
  }

  return (
    <Switch>
      <Route path="/">
        <Entries />
      </Route>
      <Route path="/options">
        <Options />
      </Route>
      <Route path="/:anything*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
