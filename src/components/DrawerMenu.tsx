import LockClockIcon from "@mui/icons-material/LockClock";
import SecurityIcon from "@mui/icons-material/Security";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import React from "react";
import { Link, useRoute } from "wouter";

import SettingNestedList from "./SettingNestedList";
import ThemeModeMenu from "./ThemeModeMenu";
import ToolbarOffset from "./ToolbarOffset";

const anchor = "left";
const drawerWidth = 175;

const routes = [
  { path: DEFAULT_POPUP_URL, name: t("entries"), icon: <LockClockIcon />, disabled: false },
  { path: "/security", name: t("security"), icon: <SecurityIcon />, disabled: true },
];

const ListItemButtonRoute = ({
  href,
  disabled,
  children,
  hrefPopup,
}: {
  href: string;
  hrefPopup?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const [isActive] = useRoute(href);
  return (
    <ListItemButton
      dense={true}
      disableGutters
      component={Link}
      disabled={disabled}
      selected={isActive}
      href={hrefPopup || href}
      sx={{ px: 1 }}
    >
      {children}
    </ListItemButton>
  );
};

export default function DrawerMenu({
  draweOpen,
  setDrawerOpen,
}: {
  draweOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Drawer
      anchor={anchor}
      open={draweOpen || isUpSm}
      onClose={() => setDrawerOpen(false)}
      variant={isUpSm ? "permanent" : "temporary"}
      sx={{ width: (draweOpen || isUpSm) && drawerWidth }}
    >
      <ToolbarOffset />
      <List>
        <Divider />
        {routes.map((route, index) => {
          const hrefPopup = DEFAULT_POPUP_URL;
          return (
            <>
              <ListItem key={index} disablePadding onClick={!route.disabled && handleClose}>
                <ListItemButtonRoute
                  href={route.path}
                  disabled={route.disabled}
                  hrefPopup={hrefPopup.includes("?popup=true") && hrefPopup}
                >
                  <ListItemIcon sx={{ minWidth: "auto", mr: 2, "& .MuiSvgIcon-root": { fontSize: 22 } }}>
                    {route.icon}
                  </ListItemIcon>
                  <ListItemText primary={route.name} />
                </ListItemButtonRoute>
              </ListItem>
              <Divider />
            </>
          );
        })}
        <SettingNestedList />
      </List>
      <ThemeModeMenu />
    </Drawer>
  );
}
