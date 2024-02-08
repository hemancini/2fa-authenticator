import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import packageJson from "../../../package.json";
import ToggleThemeColors from "./ToggleThemeColors";
import ToggleThemeMode from "./ToggleThemeMode";

const Version = () => {
  return (
    <Typography
      component="span"
      sx={{
        fontSize: 11,
        display: "flex",
        justifyContent: "center",
        color: (theme) => theme.palette.text.secondary,
      }}
    >
      version: {packageJson.version}
    </Typography>
  );
};

export default function ThemeModeMenu() {
  return (
    <List
      dense
      disablePadding
      sx={{
        mb: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <ListItem dense disablePadding>
        <ToggleThemeColors />
      </ListItem>
      <ListItem dense disablePadding>
        <ToggleThemeMode />
      </ListItem>
      <Version />
    </List>
  );
}
