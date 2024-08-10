import "@pages/popup/Popup.css";

import Entries from "@routes/Entries";
import { t } from "@src/chrome/i18n";
import Backup from "@src/develop/routes/Backup";
import Storage from "@src/develop/routes/Storage";
import { EntriesProviderLegacy } from "@src/legacy/contexts/Entries";
import EntriesLegacy from "@src/legacy/routes/EntriesLegacy";
import EntriesLegacyEdit from "@src/legacy/routes/EntriesLegacyEdit";
import Options from "@src/routes/Options";
import { useFeatureFlags } from "@src/stores/useFeatureFlags";
import { Redirect, Route, Switch } from "wouter";

const isDev = import.meta.env.VITE_IS_DEV === "true";

export default function RoutesPopup() {
  const { useLegacy } = useFeatureFlags();
  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  if (isPopup) {
    document.title = t("extensionName");
  }

  console.log("useLegacy:", useLegacy);

  return (
    <Switch>
      {!useLegacy ? (
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
