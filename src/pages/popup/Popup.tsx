import "@pages/popup/Popup.css";

import AppBar from "@components/AppBar";
import Entries from "@routes/Entries";
import EntriesEdit from "@routes/EntriesEdit";
import { t } from "@src/chrome/i18n";
import DrawerMenu from "@src/components/DrawerMenu";
import { EntriesProvider } from "@src/contexts/Entries";
import { OptionsProvider } from "@src/contexts/Options";
import { useState } from "react";
import { Link, Redirect, Route, Router, Switch } from "wouter";
import makeMatcher from "wouter/matcher";

const PageNotFound = () => (
  <section>
    <h4>
      <b>404:</b>
      {" Sorry, this page isn't ready yet!"}
    </h4>
    <h6>{window.location.href}</h6>
  </section>
);

const Popup = () => {
  const [draweOpen, setDrawerOpen] = useState(false);
  const isSidePanel = window.location.href.includes(DEFAULT_SIDE_PANEL_URL);

  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  if (isPopup) {
    document.title = t("extensionName");
  }

  const defaultMatcher = makeMatcher();
  const multipathMatcher = (patterns, path) => {
    for (const pattern of [patterns].flat()) {
      const [match, params] = defaultMatcher(pattern, path);
      if (match) return [match, params];
    }
    return [false, null];
  };

  return (
    <OptionsProvider>
      <EntriesProvider>
        <Router matcher={multipathMatcher as any}>
          {!isSidePanel && !isPopup && (
            <>
              <AppBar {...{ draweOpen, setDrawerOpen }} />
              <DrawerMenu {...{ draweOpen, setDrawerOpen }} />
            </>
          )}
          <Switch>
            <Route path={["/", DEFAULT_POPUP_URL, DEFAULT_SIDE_PANEL_URL] as any}>
              <Entries />
            </Route>
            <Route path="/entries/edit">
              <EntriesEdit />
            </Route>
            <Route path="/about">
              <Link href="/">
                <a className="link">home</a>
              </Link>
            </Route>
            <Route path="/:anything*">
              <PageNotFound />
            </Route>
          </Switch>
        </Router>
      </EntriesProvider>
    </OptionsProvider>
  );
};

export default Popup;
