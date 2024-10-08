import "@pages/popup/Popup.css";

import Backup from "@routes/Backups";
import Entries from "@routes/Entries";
import { t } from "@src/chrome/i18n";
import { IS_DEV } from "@src/config";
import Storage from "@src/develop/routes/Storage";
import { EntriesProviderLegacy } from "@src/legacy/contexts/Entries";
import EntriesLegacy from "@src/legacy/routes/EntriesLegacy";
import EntriesLegacyEdit from "@src/legacy/routes/EntriesLegacyEdit";
import Options from "@src/routes/Options";
import { useOptionsStore } from "@src/stores/useOptions";
import { Redirect, Route, Switch } from "wouter";

export default function RoutesPopup() {
  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  const { useLegacyEntryCard } = useOptionsStore();

  if (isPopup) {
    document.title = t("extensionName");
  }

  return (
    <Switch>
      {!useLegacyEntryCard ? (
        <>
          <Route path="/" component={Entries} />
          <Route path="/edit" component={Entries} />
          <Route path="/account/bypass" component={Entries} />
        </>
      ) : (
        <>
          <Route
            path="/"
            component={() => (
              <EntriesProviderLegacy>
                <EntriesLegacy />
              </EntriesProviderLegacy>
            )}
          />
          <Route
            path="/edit"
            component={() => (
              <EntriesProviderLegacy>
                <EntriesLegacyEdit />
              </EntriesProviderLegacy>
            )}
          />
        </>
      )}
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
