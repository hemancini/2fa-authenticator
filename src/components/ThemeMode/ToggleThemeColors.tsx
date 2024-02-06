import SquareIcon from "@mui/icons-material/Square";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { t } from "@src/chrome/i18n";
import { useOptionsStore } from '@src/stores/useOptionsStore';

import Tooltip from "../Tooltip";

export default function ToggleThemeColors() {
  const { themeColor, toggleThemeColor } = useOptionsStore();

  const handleChange = (event: SelectChangeEvent<typeof themeColor>) => {
    const colorSelected = event.target.value as DefaultColorHexes;
    toggleThemeColor(colorSelected);
  };

  return (
    <Tooltip title={t("chooseColor")} disableInteractive>
      <FormControl sx={{ mx: 1 }} fullWidth>
        <InputLabel>Color</InputLabel>
        <Select
          size="small"
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
          defaultValue={themeColor}
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
            <MenuItem key={color.name} value={color.hex} dense>
              <Box sx={{
                display: "flex",
                alignItems: "center",
              }}>
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
