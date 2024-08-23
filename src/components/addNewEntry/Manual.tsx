import CustomItemButton from "@components/Options/CustomItemButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import type { TextFieldProps } from "@mui/material/TextField";
import { t } from "@src/chrome/i18n";
import { OTPEntry } from "@src/entry/otp";
import { useEntries } from "@src/stores/useEntries";
import { useState } from "react";

import { useAddType } from "./useAddType";

export function ManualButton() {
  const { setAddType } = useAddType();

  const handleManual = () => {
    setAddType("manual");
  };

  return (
    <>
      <Divider />
      <CustomItemButton
        primary={t("manualEntry")}
        toolltip={t("manualEntry")}
        handleButton={handleManual}
        icon={<KeyboardIcon />}
        disableLeftPadding
      />
    </>
  );
}

export default function Manual() {
  const [isAdvance, setAdvance] = useState(false);
  const { setAddType, setSuccessMessage } = useAddType();

  const { addEntry } = useEntries();

  const handleAdvanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvance(event.target.checked);
  };

  const handleCancel = () => {
    setAddType(undefined);
  };

  const handleAddEntry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // todo: add entry
    const data = new FormData(event.currentTarget);
    const [issuer = "", secret, account = "", period, digits, type, algorithm] = data.values();
    console.log(issuer, secret, account, period, digits, type, algorithm);

    if (!secret) {
      setAddType("error");
      setSuccessMessage("Secret is required");
      return;
    }

    const newEntry = new OTPEntry({
      issuer: issuer as string,
      account: account as string,
      secret: secret as string,
      period: parseInt(period as string) as OTPPeriod,
      digits: parseInt(digits as string) as OTPDigits,
      type: type as OTPType,
      algorithm: algorithm as OTPAlgorithm,
    });

    // alert(JSON.stringify(newEntry, null, 2));
    addEntry(newEntry);

    setAddType("success");
    setSuccessMessage(t("addEntrySuccess", newEntry?.account ?? newEntry?.issuer));
  };

  return (
    <Grid
      component="form"
      autoComplete="off"
      onSubmit={handleAddEntry}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <CustomTextField name="issuer" inputProps={{ minLength: 3, maxLength: 24 }} />
      <CustomTextField required name="secret" inputProps={{ minLength: 8, maxLength: 120 }} />
      <CustomTextField name="account" inputProps={{ minLength: 3, maxLength: 24 }} />
      <FormGroup>
        <FormControlLabel
          label="Advance"
          onChange={handleAdvanceChange}
          sx={{
            "& span": { p: 0, pl: 1 },
            "& .MuiFormControlLabel-label": { pl: 0 },
          }}
          control={<Checkbox icon={<ArrowRightIcon />} checkedIcon={<ArrowDropDownIcon />} />}
        />
      </FormGroup>
      <Grid container spacing={2} sx={{ display: isAdvance ? "flex" : "none" }}>
        <Grid item xs={6}>
          <CustomTextField required name="period" defaultValue={30} inputProps={{ min: 10, max: 60 }} />
        </Grid>
        <Grid item xs={6}>
          <FormControl size="small" fullWidth>
            <InputLabel>digits</InputLabel>
            <Select name="digits" label="digits" defaultValue={6}>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={8}>8</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl size="small" fullWidth>
            <InputLabel>type</InputLabel>
            <Select name="type" label="type" defaultValue="totp">
              <MenuItem value="totp">TOTP</MenuItem>
              <MenuItem value="hotp" disabled>
                HOTP
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl size="small" fullWidth>
            <InputLabel>algorithm</InputLabel>
            <Select name="algorithm" label="algorithm" defaultValue="SHA1">
              <MenuItem value={"SHA1"}>SHA-1</MenuItem>
              <MenuItem value={"SHA256"}>SHA-256</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Button size="small" variant="outlined" onClick={handleCancel}>
          {t("back")}
        </Button>
        <Button type="submit" size="small" variant="contained" fullWidth>
          {t("add")}
        </Button>
      </Box>
    </Grid>
  );
}

const CustomTextField = (props: TextFieldProps) => {
  return <TextField fullWidth size="small" variant="outlined" label={props.name} {...props} />;
};
