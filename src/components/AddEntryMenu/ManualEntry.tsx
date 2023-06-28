import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";

export interface AddEntryProps {
  handlerOnCandel: () => void;
  handleOnAddEntryClose?: () => void;
}
export interface AddEntryMenuProps {
  isAddEntryMenuOpen: boolean;
  setAddEntryMenuOpen: (isAddEntryMenuOpen: boolean) => void;
}

export default function ManualEntry(props: AddEntryProps) {
  const { handlerOnCandel } = props;
  const [isAdvance, setAdvance] = useState(false);
  const [age, setAge] = useState("");

  const handleAdvanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvance(event.target.checked);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <Box>
      <Box mx={0.5} display="grid" gap={2} mb={2.5}>
        <TextField label="issuer" size="small" />
        <TextField label="secret" size="small" />
        <FormGroup>
          <FormControlLabel
            label="Advance"
            onChange={handleAdvanceChange}
            sx={{ "&& span": { p: 0, pl: 1 }, "&& .MuiFormControlLabel-label": { pl: 0 } }}
            control={<Checkbox icon={<ArrowRightIcon />} checkedIcon={<ArrowDropDownIcon />} />}
          />
        </FormGroup>
        {isAdvance && (
          <>
            <TextField label="username" size="small" />
            <TextField label="period" size="small" type="number" />
            <FormControl size="small" fullWidth>
              <InputLabel>digits</InputLabel>
              <Select value={age} label="digits" onChange={handleChange}>
                <MenuItem value={10}>6</MenuItem>
                <MenuItem value={20}>8</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>type</InputLabel>
              <Select value={age} label="type" onChange={handleChange}>
                <MenuItem value={10}>Time base</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>algorithm</InputLabel>
              <Select value={age} label="algorithm" onChange={handleChange}>
                <MenuItem value={10}>SHA-1</MenuItem>
                <MenuItem value={20}>SHA-256</MenuItem>
                <MenuItem value={30}>SHA-512</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
      </Box>
      <Box mt={1} display="grid" gap={2} gridTemplateColumns="1fr 1fr">
        <Button size="small" variant="outlined" fullWidth onClick={handlerOnCandel}>
          Cancel
        </Button>
        <Button size="small" variant="contained" fullWidth>
          Add
        </Button>
      </Box>
    </Box>
  );
};
