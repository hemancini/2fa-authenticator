import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Switch from "@mui/material/Switch";
import { useOptionsStore } from "@src/stores/useOptions";

export default function NewVersion() {
  const { isNewVersion, toggleNewVersion } = useOptionsStore();
  return (
    <List
      dense
      disablePadding
      sx={{
        mb: 0,
        mx: 1,
      }}
    >
      <ListItem disablePadding>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={isNewVersion} onChange={toggleNewVersion} />}
            label="New version"
          />
        </FormGroup>
      </ListItem>
    </List>
  );
}
