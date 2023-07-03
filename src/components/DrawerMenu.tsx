import LockClockIcon from "@mui/icons-material/LockClock";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useRoute } from "wouter";

import packageJson from "../../package.json";
import SelectThemeColors from "./SelectThemeColors";
import ToggleThemeMode from "./ToggleThemeMode";
import ToolbarOffset from "./ToolbarOffset";

const anchor = "left";
const routes = [
  { path: DEFAULT_POPUP_URL, name: "Entries", icon: <LockClockIcon />, disabled: false },
  { path: "/security", name: "Security", icon: <SecurityIcon />, disabled: true },
  { path: "/settings", name: "Settings", icon: <SettingsIcon />, disabled: true },
];

const themeCustomization: ThemeOptions = {
  spacing: 5,
  typography: {
    fontSize: 12,
  },
  components: {
    MuiList: {
      defaultProps: {
        dense: true,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiToggleButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          padding: 3,
        },
      },
    },
  },
};

const ListItemButtonRoute = ({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const [isActive] = useRoute(href);
  return (
    <ListItemButton disabled={disabled} component={Link} href={href} selected={isActive} dense={true}>
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
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const handleClose = () => {
    setDrawerOpen(false);
  };
  return (
    <Drawer
      anchor={anchor}
      open={draweOpen || isSm}
      onClose={() => setDrawerOpen(false)}
      variant={!isSm ? "temporary" : "permanent"}
    >
      <ToolbarOffset />
      <List>
        <Divider />
        {routes.map((route, index) => (
          <>
            <ListItem key={index} disablePadding onClick={!route.disabled && handleClose}>
              <ListItemButtonRoute href={route.path} disabled={route.disabled}>
                <ListItemIcon sx={{ minWidth: "auto", mr: 2, "& .MuiSvgIcon-root": { fontSize: 22 } }}>
                  {route.icon}
                </ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButtonRoute>
            </ListItem>
            <Divider />
          </>
        ))}
        <>
          <ListItem
            disablePadding
            onClick={() => {
              const windowType = "panel";
              chrome.windows
                .create({
                  url: chrome.runtime.getURL(`${DEFAULT_POPUP_URL}?popup=true`),
                  type: windowType,
                  height: window.innerHeight + 40,
                  width: window.innerWidth,
                })
                .then(() => {
                  window.close();
                });
            }}
          >
            <ListItemButton dense={true}>
              <ListItemIcon sx={{ minWidth: "auto", mr: 2, "& .MuiSvgIcon-root": { fontSize: 22 } }}>
                <OpenInNewIcon />
              </ListItemIcon>
              <ListItemText primary={"Poup"} />
            </ListItemButton>
          </ListItem>
          <Divider />
        </>
      </List>
      <ThemeProvider
        theme={(theme) =>
          createTheme({
            ...theme,
            ...themeCustomization,
          })
        }
      >
        <List
          disablePadding
          sx={{
            mb: 0,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
        >
          <Divider />
          <SelectThemeColors />
          <ListItem disablePadding sx={{ justifyContent: "center" }}>
            <ToggleThemeMode />
          </ListItem>
          <Typography
            component="span"
            sx={{
              display: "flex",
              justifyContent: "center",
              fontSize: 11,
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            version: {packageJson.version}
          </Typography>
        </List>
      </ThemeProvider>
    </Drawer>
  );
}
