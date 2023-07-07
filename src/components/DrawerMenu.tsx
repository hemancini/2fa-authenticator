import LockClockIcon from "@mui/icons-material/LockClock";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { t } from "@src/chrome/i18n";
import OptionsContext from "@src/contexts/Options";
import { useContext } from "react";
import { Link, useRoute } from "wouter";

import packageJson from "../../package.json";
import SelectThemeColors from "./SelectThemeColors";
import ToggleThemeMode from "./ToggleThemeMode";
import ToolbarOffset from "./ToolbarOffset";

const anchor = "left";
const drawerWidth = 130;

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
  hrefPopup,
}: {
  href: string;
  hrefPopup?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const [isActive] = useRoute(href);
  return (
    <ListItemButton disabled={disabled} component={Link} href={hrefPopup || href} selected={isActive} dense={true}>
      {children}
    </ListItemButton>
  );
};

const SwitchTooltip = () => {
  const { tooltipEnabled, toggleTooltipEnabled } = useContext(OptionsContext);
  return (
    <FormControlLabel
      // label={t("showTooltip")}
      label="Tooltip"
      labelPlacement="start"
      control={
        <Switch
          size="small"
          checked={tooltipEnabled}
          onChange={toggleTooltipEnabled}
          sx={{
            width: 32,
            height: 22,
            "& .MuiSwitch-thumb": { width: 14, height: 14 },
            "& .MuiSwitch-switchBase.Mui-checked": {
              transform: "translateX(10px)",
              color: "primary.main",
              "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: "primary.dark",
              },
            },
          }}
        />
      }
    />
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

  const handleOpenPopup = () => {
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
        <>
          <ListItem disablePadding onClick={handleOpenPopup}>
            <ListItemButton dense={true}>
              <ListItemIcon sx={{ minWidth: "auto", ml: 0.2, mr: 2, "& .MuiSvgIcon-root": { fontSize: 20 } }}>
                <OpenInNewIcon />
              </ListItemIcon>
              <ListItemText primary={"Popup"} />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem
            disablePadding
            sx={{
              "& .MuiTypography-root": { fontSize: 14 },
            }}
          >
            <SwitchTooltip />
          </ListItem>
          <Divider />
        </>
      </List>
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
        <ThemeProvider
          theme={(theme) =>
            createTheme({
              ...theme,
              ...themeCustomization,
            })
          }
        >
          <Divider sx={{ mb: 1.5 }} />
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
        </ThemeProvider>
      </List>
    </Drawer>
  );
}
