import "@pages/popup/Popup.css";

import Backup from "@routes/Backups";
import Entries from "@routes/Entries";
import { t } from "@src/chrome/i18n";
import { IS_DEV } from "@src/config";
import Storage from "@src/develop/routes/Storage";
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
      <Route path="/" component={Entries} />
      <Route path="/edit" component={Entries} />
      <Route path="/account/bypass" component={Entries} />
      <Route path="/options">
        <Options />
      </Route>
      <Route path="/backup">
        <Backup />
      </Route>
      {IS_DEV && (
        <Switch>
          <Route path="/storage">
            <Storage />
          </Route>
        </Switch>
      )}
      <Route path="/:anything*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
