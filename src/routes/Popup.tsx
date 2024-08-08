import "@pages/popup/Popup.css";

import Entries from "@routes/Entries";
import { t } from "@src/chrome/i18n";
import Backup from "@src/develop/routes/Backup";
import Storage from "@src/develop/routes/Storage";
import Options from "@src/routes/Options";
import { Redirect, Route, Switch } from "wouter";

const isDev = import.meta.env.VITE_IS_DEV === "true";

export default function RoutesPopup() {
  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  if (isPopup) {
    document.title = t("extensionName");
  }

  return (
    <Switch>
      {/* TODO: init - optimize the routes */}
      <Route path="/" component={Entries} />
      <Route path="/edit" component={Entries} />
      <Route path="/account/bypass" component={Entries} />
      {/* TODO: fin - optimize the routes */}
      <Route path="/options">
        <Options />
      </Route>
      {isDev && (
        <Switch>
          <Route path="/storage">
            <Storage />
          </Route>
          <Route path="/backup">
            <Backup />
          </Route>
        </Switch>
      )}
      <Route path="/:anything*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
