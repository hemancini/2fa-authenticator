import "@pages/popup/Popup.css";

import Entries from "@routes/Entries";
import EntriesLegacy from "@routes/EntriesLegacy";
import EntriesLegacyEdit from "@routes/EntriesLegacyEdit";
import { t } from "@src/chrome/i18n";
import Options from "@src/routes/Options";
import { useOptionsStore } from "@src/stores/useOptions";
import { Redirect, Route, Switch } from "wouter";

export default function Popup() {
  const { isNewVersion } = useOptionsStore();

  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  if (isPopup) {
    document.title = t("extensionName");
  }

  return (
    <Switch>
      <Route path="/">{isNewVersion ? <Entries /> : <EntriesLegacy />}</Route>
      <Route path="/legacy/edit">
        <EntriesLegacyEdit />
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
