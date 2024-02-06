import "@pages/popup/Popup.css";

import AppBar from "@components/AppBar";
import DrawerMenu from "@components/DrawerMenu";
import ToolbarOffset from "@components/ToolbarOffset";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Entries from "@routes/Entries";
import EntriesEdit from "@routes/EntriesEdit";
import Settings from "@routes/Settings";
import { t } from "@src/chrome/i18n";
import { useOptionsStore } from '@src/stores/useOptionsStore';
import React, { useCallback, useContext, useState } from "react";
import { Redirect, Route, Router, Switch } from "wouter";
import makeMatcher from "wouter/matcher";
import { navigate, useLocationProperty } from "wouter/use-location";

const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";
const hashNavigate = (to) => navigate("#" + to);

const useHashLocation = () => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};

const defaultMatcher = makeMatcher();

const multipathMatcher = (patterns, path) => {
  for (const pattern of [patterns].flat()) {
    const [match, params] = defaultMatcher(pattern, path);
    if (match) return [match, params];
  }
  return [false, null];
};

export default function Popup() {
  const { xraysEnabled } = useOptionsStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSidePanel = window.location.href.includes(DEFAULT_SIDE_PANEL_URL);

  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  if (isPopup) {
    document.title = t("extensionName");
  }

  return (
    <Router base={window.location.pathname} matcher={multipathMatcher as any} hook={useHashLocation as any}>
      <Box sx={{ display: "flex", "& *": xraysEnabled ? { border: "0.5px solid black" } : {} }}>
        {!isSidePanel && !isPopup && (
          <React.Fragment>
            <AppBar {...{ drawerOpen, setDrawerOpen }} />
            <DrawerMenu {...{ drawerOpen, setDrawerOpen }} />
          </React.Fragment>
        )}
        <Container component="main" maxWidth="sm" sx={{ py: 0.7, flexGrow: 1 }}>
          {!isSidePanel && !isPopup && <ToolbarOffset />}
          <Switch>
            <Route path={["/", DEFAULT_POPUP_URL, DEFAULT_SIDE_PANEL_URL] as any}>
              <Entries />
            </Route>
            <Route path="/entries/edit">
              <EntriesEdit />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/:anything*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Container>
      </Box>
    </Router>
  );
};

