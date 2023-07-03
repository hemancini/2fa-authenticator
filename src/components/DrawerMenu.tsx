import LockClockIcon from "@mui/icons-material/LockClock";
import SecurityIcon from "@mui/icons-material/Security";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link, useRoute } from "wouter";

import packageJson from "../../package.json";
import SelectThemeColors from "./SelectThemeColors";
import ToggleThemeMode from "./ToggleThemeMode";

const anchor = "left";
const routes = [
  { path: "/src/pages/popup/index.html", name: "Entries", icon: <LockClockIcon />, disabled: false },
  { path: "/security", name: "Security", icon: <SecurityIcon />, disabled: true },
  { path: "/settings", name: "Settings", icon: <SettingsIcon />, disabled: true },
];

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

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
    <ListItemButton disabled={disabled} component={Link} href={href} selected={isActive}>
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
  const handleClose = () => {
    setDrawerOpen(false);
  };
  return (
    <Drawer anchor={anchor} open={draweOpen} onClose={() => setDrawerOpen(false)}>
      <Offset />
      <List>
        <Divider />
        {routes.map((route, index) => (
          <>
            <ListItem key={index} disablePadding onClick={!route.disabled && handleClose}>
              <ListItemButtonRoute href={route.path} disabled={route.disabled}>
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButtonRoute>
            </ListItem>
            <Divider />
          </>
        ))}
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
        <Divider sx={{ mx: 0.5 }} />
        <SelectThemeColors />
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <ToggleThemeMode />
        </ListItem>
        {/* <Divider sx={{ mx: 0.5 }} /> */}
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
    </Drawer>
  );
}
