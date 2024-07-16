import { CustomIconButton } from "@components/CardEntry/Utils";
import CustomDialog from "@components/CustomDialog";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, FormControl, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { t } from "@src/chrome/i18n";
import useUrlHashState from "@src/hooks/useUrlHashState";
import { decrypData, encrypData } from "@src/models/encryption";
import type { EntryState, OTPEntry } from "@src/otp/type";
import { useEntries } from "@src/stores/useEntries";
import { useOptionsStore } from "@src/stores/useOptions";

const issuerBypass = "WOM";
const regexEAS = /^[A-Za-z0-9+/=]+$/;

export default function AccountBypassDialog({ entry }: { entry: OTPEntry }) {
  const { bypassEnabled } = useOptionsStore();
  if (!bypassEnabled) return null;

  const { issuer, user, pass } = entry;
  if (issuer !== issuerBypass) return null;

  const { upsertEntry } = useEntries() as EntryState;
  const [isAccountBypass, toggleAccountBypass] = useUrlHashState("#/account/bypass");

  const handleSubmited = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formDataObject: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });

    const { user, pass } = formDataObject;
    upsertEntry({ ...entry, user: encrypData(user), pass: encrypData(pass) });

    toggleAccountBypass();
  };

  return (
    <CustomDialog
      title={entry?.issuer || entry?.account}
      isOpen={isAccountBypass}
      handleOpen={toggleAccountBypass}
      handleClose={() => toggleAccountBypass()}
      content={
        <Box
          component="form"
          autoComplete="off"
          onSubmit={handleSubmited}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            fullWidth
            name="user"
            size="small"
            label={t("user")}
            variant="outlined"
            defaultValue={decrypData(user)}
            inputProps={{ maxLength: 120 }}
          />
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel>{t("pass")}</InputLabel>
            <OutlinedInput
              fullWidth
              name="pass"
              type="password"
              label={t("pass")}
              defaultValue={decrypData(pass)}
              inputProps={{ maxLength: 120 }}
            />
          </FormControl>
          <Box sx={{ display: "flex", justifyItems: "center", gap: 2 }}>
            <Button fullWidth size="small" variant="outlined" onClick={toggleAccountBypass}>
              {t("cancel")}
            </Button>
            <Button fullWidth size="small" variant="contained" type="submit">
              {t("save")}
            </Button>
          </Box>
        </Box>
      }
    />
  );
}

export const AccountBypassButton = ({ entry }: { entry: OTPEntry }) => {
  const { bypassEnabled } = useOptionsStore();
  if (!bypassEnabled) return null;

  const { issuer, user, pass } = entry;
  if (issuer !== issuerBypass) return null;

  const [, toggleAccountBypass] = useUrlHashState("#/account/bypass");
  const isValidData = regexEAS.test(user) && regexEAS.test(pass);

  return (
    <CustomIconButton sx={{ height: 24, width: 24, mr: 0.5 }} title={t("user")} onClick={toggleAccountBypass}>
      <PersonIcon sx={{ color: (theme) => isValidData && theme.palette.primary.main }} />
    </CustomIconButton>
  );
};
