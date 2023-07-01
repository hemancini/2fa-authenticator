import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import packageJson from "../../package.json";
import SelectThemeColors from "./SelectThemeColors";
import ToggleThemeMode from "./ToggleThemeMode";

const anchor = "left";

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function TemporaryDrawer({
  draweOpen,
  setDrawerOpen,
}: {
  draweOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Drawer anchor={anchor} open={draweOpen} onClose={() => setDrawerOpen(false)}>
      <Offset />
      <List>
        <Divider sx={{ mx: 0.5 }} />
        {["Entries", "Security", "Settings"].map((text, index) => (
          <>
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ mx: 0.5 }} />
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
