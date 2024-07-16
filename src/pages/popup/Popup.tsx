import "@pages/popup/Popup.css";

import ToolbarOffset from "@components/ToolbarOffset";
import AppBar from "@components/widgets/AppBar";
import Siderbar from "@components/widgets/Sidebar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Entries from "@routes/Entries";
import EntriesLegacy from "@routes/EntriesLegacy";
import EntriesLegacyEdit from "@routes/EntriesLegacyEdit";
import { t } from "@src/chrome/i18n";
import Options from "@src/routes/Options";
import { useOptionsStore } from "@src/stores/useOptions";
import React, { useState } from "react";
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
  const { xraysEnabled, isNewVersion } = useOptionsStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSidePanel = window.location.href.includes(DEFAULT_SIDE_PANEL_URL);

  const urlObj = new URL(decodeURIComponent(window.location.href));
  const isPopup = urlObj.searchParams.get("popup") === "true";

  if (isPopup) {
    document.title = t("extensionName");
  }

  return (
    <Router base={window.location.pathname} matcher={multipathMatcher as any} hook={useHashLocation as any}>
      <Box
        sx={{
          display: "flex",
          "& *": xraysEnabled ? { border: "0.5px solid black" } : {},
        }}
      >
        {!isSidePanel && !isPopup && (
          <React.Fragment>
            <AppBar {...{ drawerOpen, setDrawerOpen }} />
            <Siderbar {...{ drawerOpen, setDrawerOpen }} />
          </React.Fragment>
        )}
        <Container component="main" maxWidth="sm" sx={{ py: 0.7, flexGrow: 1, px: "0.8rem" }}>
          {!isSidePanel && !isPopup && <ToolbarOffset />}
          <Switch>
            <Route path={["/", "/edit", DEFAULT_POPUP_URL, DEFAULT_SIDE_PANEL_URL] as any}>
              {isNewVersion ? <Entries /> : <EntriesLegacy />}
            </Route>
            <Route path="/entries/edit">
              <EntriesLegacyEdit />
            </Route>
            <Route path="/options">
              <Options />
            </Route>
            <Route path="/:anything*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Container>
      </Box>
    </Router>
  );
}
