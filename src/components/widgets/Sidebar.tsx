import NewVersion from "@components/NewVersion";
// import OptionsNestedList from "@components/OptionsNestedList";
import ThemeModeSelect from "@components/ThemeMode";
import ToolbarOffset from "@components/ToolbarOffset";
import LockClockIcon from "@mui/icons-material/LockClock";
import SettingsIcon from "@mui/icons-material/Settings";
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

const anchor = "left";
const drawerWidth = 175;

const routes = [
  { path: "/", name: t("entries"), icon: <LockClockIcon />, disabled: false },
  {
    path: "/options",
    name: t("options"),
    icon: <SettingsIcon />,
    disabled: false,
  },
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
      component={Link}
      sx={{ "& .MuiListItemText-root": { mr: 1 } }}
      disabled={disabled}
      selected={isActive}
      href={hrefPopup || href}
    >
      {children}
    </ListItemButton>
  );
};

export default function Siderbar({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
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
      open={drawerOpen || isUpSm}
      onClose={() => setDrawerOpen(false)}
      variant={isUpSm ? "permanent" : "temporary"}
      sx={{ width: (drawerOpen || isUpSm) && drawerWidth }}
    >
      <ToolbarOffset />
      <List>
        <Divider />
        {routes.map((route, index) => {
          return (
            <div key={index}>
              <ListItem disablePadding onClick={!route.disabled && handleClose}>
                <ListItemButtonRoute
                  href={route.path}
                  disabled={route.disabled}
                  hrefPopup={DEFAULT_POPUP_URL.includes("?popup=true") && DEFAULT_POPUP_URL}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "auto",
                      mr: 2,
                      "& .MuiSvgIcon-root": { fontSize: 22 },
                    }}
                  >
                    {route.icon}
                  </ListItemIcon>
                  <ListItemText primary={route.name} />
                </ListItemButtonRoute>
              </ListItem>
              <Divider />
            </div>
          );
        })}
        {/* <OptionsNestedList /> */}
      </List>
      <NewVersion />
      <Divider />
      <ThemeModeSelect />
    </Drawer>
  );
}
