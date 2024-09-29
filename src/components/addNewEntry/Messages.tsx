import { Alert, Box, Button } from "@mui/material";
import { t } from "@src/chrome/i18n";
import { useModalStore } from "@src/stores/useModal";
import { useLocation } from "wouter";

import { useAddType } from "./useAddType";

export const SuccessMessage = () => {
  const { setAddType, successMessage } = useAddType();
  const [location, setLocation] = useLocation();
  const { toggleModal } = useModalStore();

  const handleSuccess = () => {
    setAddType(undefined);
    toggleModal("add-entry-modal");

    if (location !== "/") setLocation("/");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Alert severity="success" sx={{ width: "auto", mb: 0.8 }}>
        {successMessage}
      </Alert>
      <Button size="small" variant="contained" fullWidth onClick={handleSuccess}>
        {t("accept")}
      </Button>
    </Box>
  );
};

export const ErrorMesssage = ({ lastType }: { lastType: AddType }) => {
  const { setAddType, successMessage } = useAddType();

  const handleRetry = () => {
    setAddType(lastType);
  };

  const handleBack = () => {
    setAddType(undefined);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Alert severity="error" sx={{ width: "auto", mb: 0.8 }}>
        {successMessage}
      </Alert>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Button size="small" onClick={handleBack} variant="outlined">
          {t("back")}
        </Button>
        <Button size="small" variant="contained" fullWidth onClick={handleRetry}>
          {t("retry")}
        </Button>
      </Box>
    </Box>
  );
};
