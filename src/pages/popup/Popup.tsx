import "@pages/popup/Popup.css";

import ToolbarOffset from "@components/ToolbarOffset";
import AppBar from "@components/widgets/AppBar";
import Siderbar from "@components/widgets/Sidebar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { t } from "@src/chrome/i18n";
import RoutesPopup from "@src/routes/Popup";
import { useOptionsStore } from "@src/stores/useOptions";
import React, { useState } from "react";
import { Router } from "wouter";
import makeMatcher, { MatcherFn } from "wouter/matcher";
import { navigate, useLocationProperty } from "wouter/use-location";

const hashLocation = () => window.location.hash.replace(/^#/, "") || "/";
const hashNavigate = (to: string) => navigate("#" + to);

const useHashLocation = (): [string, (to: string) => void] => {
  const location = useLocationProperty(hashLocation);
  return [location, hashNavigate];
};

const defaultMatcher = makeMatcher();

const multipathMatcher: MatcherFn = (patterns, path) => {
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
    <Router base={window.location.pathname} matcher={multipathMatcher} hook={useHashLocation}>
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
          <RoutesPopup />
        </Container>
      </Box>
    </Router>
  );
}
