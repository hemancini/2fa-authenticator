import ThemeModeSelect from "@components/ThemeMode";
import ToolbarOffset from "@components/ToolbarOffset";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import LockClockIcon from "@mui/icons-material/LockClock";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { t } from "@src/chrome/i18n";
import { IS_DEV } from "@src/config";
import { DEFAULT_POPUP_URL } from "@src/config";
import { useScreenSize } from "@src/hooks/useScreenSize";
import { useOptionsStore } from "@src/stores/useOptions";
import React from "react";
import { Link, useRoute } from "wouter";

const anchor = "left";
const drawerWidth = 120;

interface Routes {
  path: string;
  name: string;
  icon: React.ReactNode;
  disabled?: boolean;
  visible?: boolean;
}

interface SidebarProps {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Siderbar({ drawerOpen, setDrawerOpen }: SidebarProps) {
  const { isUpSm } = useScreenSize();
  const { useGoogleBackup } = useOptionsStore();

  const handleClose = () => {
    setDrawerOpen(false);
  };

  const routes: Routes[] = [
    {
      path: "/",
      name: t("entries"),
      icon: <LockClockIcon />,
      disabled: false,
    },
    {
      path: "/options",
      name: t("options"),
      icon: <SettingsIcon />,
      disabled: false,
    },
    {
      path: "/backup",
      name: t("backups"),
      icon: <CloudSyncIcon />,
      visible: useGoogleBackup,
    },
    {
      path: "/storage",
      name: "Storage",
      icon: <SaveIcon />,
      visible: IS_DEV,
    },
  ];

  return (
    <Drawer
      anchor={anchor}
      open={drawerOpen || isUpSm}
      onClose={() => setDrawerOpen(false)}
      variant={isUpSm ? "permanent" : "temporary"}
      sx={{ width: (drawerOpen || isUpSm) && drawerWidth }}
    >
      <ToolbarOffset />
      <List disablePadding sx={{ pt: 1 }}>
        <Divider />
        {routes.map((route, index) => {
          return (
            !(route.visible === false) && (
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
            )
          );
        })}
      </List>
      <ThemeModeSelect />
    </Drawer>
  );
}

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
