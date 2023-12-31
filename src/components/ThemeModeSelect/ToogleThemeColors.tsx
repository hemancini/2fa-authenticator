import SquareIcon from "@mui/icons-material/Square";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { t } from "@src/chrome/i18n";
import OptionsContext from "@src/contexts/Options";
import { useContext } from "react";

import Tooltip from "../Tooltip";

export default function ToogleThemeColors() {
  const { toggleThemeColor, defaultColor } = useContext(OptionsContext);

  const handleChange = (event: SelectChangeEvent<typeof defaultColor>) => {
    const colorSelected = event.target.value as DefaultColorHexes;
    toggleThemeColor(colorSelected);
  };

  return (
    <Tooltip title={t("chooseColor")} disableInteractive>
      <FormControl sx={{ m: 1 }}>
        <InputLabel>Color</InputLabel>
        <Select
          label="Color"
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 48 * 4.5 + 8,
                minWidth: "inherit",
                maxWidth: "inherit",
              },
            },
          }}
          onChange={handleChange}
          defaultValue={defaultColor}
          input={
            <OutlinedInput
              label="Color"
              sx={{
                "& .MuiSelect-select": {
                  p: 0,
                  px: 1,
                },
              }}
            />
          }
        >
          {DEFAULT_COLORS.map((color) => (
            <MenuItem key={color.name} value={color.hex}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SquareIcon sx={{ borderRadius: 4, mr: 1, color: color.hex }} />
                <ListItemText primary={color.name} />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Tooltip>
  );
}
