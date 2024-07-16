import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { t } from "@src/chrome/i18n";
import { decrypData, encrypData } from "@src/models/encryption";
import { OTPEntry } from "@src/models/otp";
import React, { useState } from "react";

import BootstrapDialog from "../BootstrapDialog";

export default function EditAccount({
  entry,
  isOpen,
  setOpen,
  handleEntriesUpdate,
}: {
  entry: OTPEntry;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  handleEntriesUpdate: () => void;
}) {
  const [user, setUser] = useState(decrypData(entry.user) || "");
  const [pass, setPass] = useState(decrypData(entry.pass) || "");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setUser(decrypData(entry.user) || "");
      setPass(decrypData(entry.pass) || "");
    }, 200);
  };

  const handleChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => setUser(event.target.value);

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => setPass(event.target.value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { user: encrypData(user), pass: encrypData(pass) };
    // console.log(JSON.stringify(data));
    entry.user = data.user;
    entry.pass = data.pass;
    await entry.update();
    await handleEntriesUpdate();
    handleClose();
  };

  return (
    <BootstrapDialog
      title={entry?.issuer || entry?.account}
      isOpen={isOpen}
      handleOpen={handleOpen}
      handleClose={handleClose}
      content={
        <Box component={"form"} noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label={t("user")}
                variant="outlined"
                name="user"
                defaultValue={entry.user}
                value={user}
                onChange={handleChangeUser}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel>{t("pass")}</InputLabel>
                <OutlinedInput
                  name="pass"
                  onChange={handleChangePassword}
                  defaultValue={entry.pass}
                  value={pass}
                  type="password"
                  label={t("pass")}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                my: 1,
              }}
            >
              <Button fullWidth size="small" variant="outlined" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button fullWidth size="small" variant="contained" type="submit">
                {t("save")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      }
    />
  );
}
