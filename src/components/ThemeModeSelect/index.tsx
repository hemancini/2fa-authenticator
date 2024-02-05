import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ThemeOptions } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import packageJson from "../../../package.json";
import ToggleThemeMode from "./ToggleThemeMode";
import ToggleThemeColors from "./ToggleThemeColors";

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

export default function ThemeModeMenu() {
  return (
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
        <ToggleThemeColors />
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
  );
}
