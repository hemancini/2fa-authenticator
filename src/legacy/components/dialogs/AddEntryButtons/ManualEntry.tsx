import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { t } from "@src/chrome/i18n";
import { OTPEntry } from "@src/entry/otp";
import type { OTPAlgorithm, OTPDigits, OTPPeriod } from "@src/entry/type";
import { useEntries } from "@src/stores/useEntries";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

export interface AddEntryProps {
  handlerOnCandel: () => void;
  handleOnAddEntryClose?: () => void;
  handlerGoToHome?: () => void;
}

export interface AddEntryMenuProps {
  isAddEntryMenuOpen: boolean;
  setAddEntryMenuOpen: (isAddEntryMenuOpen: boolean) => void;
}

const dataEntry = {
  issuer: "",
  secret: "",
  account: "",
  period: "30",
  digits: "6",
  type: "totp",
  algorithm: "SHA1",
};

export default function ManualEntry(props: AddEntryProps) {
  const { handlerOnCandel, handlerGoToHome } = props;
  const { addEntry } = useEntries();
  const [isAdded, setAdded] = useState(false);
  const [isAdvance, setAdvance] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleAdvanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvance(event.target.checked);
  };

  const handleAddEntry = async (data: FieldValues) => {
    const newEntry = new OTPEntry({
      ...dataEntry,
      ...data,
      type: "totp",
      period: parseInt(data.period) as OTPPeriod,
      digits: parseInt(data.digits) as OTPDigits,
      algorithm: data.algorithm as OTPAlgorithm,
    });
    addEntry(newEntry);
    setAdded(true);
  };

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit((data) => {
        handleAddEntry(data);
      })}
    >
      <Box mx={0.5} display="grid" gap={2} mb={2.5}>
        {!isAdded ? (
          <>
            <TextField
              label="issuer"
              size="small"
              inputProps={{ minLength: 3, maxLength: 24 }}
              {...register("issuer", { required: true })}
              {...{ error: errors.issuer !== undefined }}
            />
            <TextField
              label="secret"
              size="small"
              inputProps={{ minLength: 8, maxLength: 80 }}
              {...register("secret", { required: true })}
              {...{ error: errors.secret !== undefined }}
            />
            <TextField
              label="account"
              size="small"
              inputProps={{ minLength: 3, maxLength: 24 }}
              {...register("account", { required: true })}
              {...{ error: errors.account !== undefined }}
            />
            <FormGroup>
              <FormControlLabel
                label="Advance"
                onChange={handleAdvanceChange}
                sx={{
                  "&& span": { p: 0, pl: 1 },
                  "&& .MuiFormControlLabel-label": { pl: 0 },
                }}
                control={<Checkbox icon={<ArrowRightIcon />} checkedIcon={<ArrowDropDownIcon />} />}
              />
            </FormGroup>
            {isAdvance && (
              <>
                <TextField
                  label="period"
                  size="small"
                  type="number"
                  defaultValue={30}
                  inputProps={{ min: 10, max: 60 }}
                  {...register("period", { required: true })}
                  {...{ error: errors.period !== undefined }}
                />
                <FormControl size="small" fullWidth>
                  <InputLabel>digits</InputLabel>
                  <Select
                    label="digits"
                    defaultValue={6}
                    {...register("digits", { required: true })}
                    {...{ error: errors.digits !== undefined }}
                  >
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel>type</InputLabel>
                  <Select
                    label="type"
                    defaultValue="totp"
                    {...register("type", { required: true })}
                    {...{ error: errors.type !== undefined }}
                  >
                    <MenuItem value="totp">TOTP</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                  <InputLabel>algorithm</InputLabel>
                  <Select
                    defaultValue="SHA1"
                    label="algorithm"
                    {...register("algorithm", { required: true })}
                    {...{ error: errors.algorithm !== undefined }}
                  >
                    <MenuItem value={"SHA1"}>SHA-1</MenuItem>
                    <MenuItem value={"SHA256"}>SHA-256</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </>
        ) : (
          <Alert severity="success" sx={{ width: "auto", mb: 0.8 }}>
            {t("addEntrySuccess")}
          </Alert>
        )}
      </Box>
      <Box mt={1} display="grid" gap={2} gridTemplateColumns={!isAdded ? "1fr 1fr" : "1fr"}>
        {!isAdded ? (
          <>
            <Button size="small" variant="outlined" fullWidth onClick={handlerOnCandel}>
              {t("cancel")}
            </Button>
            <Button type="submit" size="small" variant="contained" fullWidth>
              {t("add")}
            </Button>
          </>
        ) : (
          <Button size="small" variant="contained" fullWidth onClick={() => handlerGoToHome()}>
            {t("accept")}
          </Button>
        )}
      </Box>
    </form>
  );
}
