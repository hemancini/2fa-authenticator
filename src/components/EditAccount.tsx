import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { decrypData, encrypData } from "@src/models/encryption";
import { OTPEntry } from "@src/models/otp";
import React, { useState } from "react";

import BootstrapDialog from "./BootstrapDialog";

export default function EditAccount({
  entry,
  isOpen,
  setOpen,
  handleEntriesUpdate,
}: {
  entry: OTPEntry;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  showOptions?: boolean;
  handleEntriesUpdate: () => void;
}) {
  const [user, setUser] = useState(decrypData(entry.user) || "");
  const [pass, setPass] = useState(decrypData(entry.pass) || "");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
                label="usuario"
                variant="outlined"
                name="user"
                defaultValue={entry.user}
                value={user}
                onChange={handleChangeUser}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  name="pass"
                  onChange={handleChangePassword}
                  defaultValue={entry.pass}
                  value={pass}
                  type={showPassword ? "text" : "password"}
                  // endAdornment={
                  //   <InputAdornment position="end">
                  //     <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                  //       {showPassword ? <VisibilityOff /> : <Visibility />}
                  //     </IconButton>
                  //   </InputAdornment>
                  // }
                  label="Password"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", gap: 2, my: 1 }}>
              <Button fullWidth size="small" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button fullWidth size="small" variant="contained" type="submit">
                submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      }
    />
  );
}
