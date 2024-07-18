import Countdown from "@components/CardEntry/Countdown";
import OtpCode from "@components/CardEntry/OtpCode";
import CardUtils from "@components/CardEntry/Utils";
import Tooltip from "@components/CustomTooltip";
import AccountBypassDialog from "@components/dialogs/AccountBypass";
import ConfirmRemoveEntry from "@components/dialogs/ConfirmRemoveEntry";
import ShowQR from "@components/dialogs/ShowQR";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Box, Card, IconButton, InputBase, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { t } from "@src/chrome/i18n";
import useUrlHashState from "@src/hooks/useUrlHashState";
import type { OTPEntry } from "@src/otp/type";
import { useEntriesUtils } from "@src/stores/useEntriesUtils";
import { useOptionsStore } from "@src/stores/useOptions";
import { useEffect, useState } from "react";

export default function CardEntry({ entry }: { entry: OTPEntry }) {
  const { isVisibleCodes } = useOptionsStore();
  const [isEditing] = useUrlHashState("#/edit");

  const [showQR, setShowQR] = useState(false);
  const [showUtils, setShowUtils] = useState(false);
  const [isVisibleCode, setVisibleCode] = useState(isVisibleCodes);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    setVisibleCode(isVisibleCodes);
  }, [isVisibleCodes]);

  return (
    <Box sx={{ position: "relative" }}>
      <Card
        variant="outlined"
        sx={{
          px: 0.5,
          py: 0.5,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          "&:hover": { filter: "brightness(0.96)" },
          // borderRadius: 0,
        }}
        onMouseOver={() => setShowUtils(true)}
        onMouseOut={() => setShowUtils(false)}
      >
        <CustomTypography entry={entry} property="issuer" />
        {!isEditing && (
          <CardUtils {...{ entry, showQR, setShowQR, showCardUtils: showUtils, isVisibleCode, setVisibleCode }} />
        )}
        <Box sx={{ display: "flex", gap: 4 }}>
          <OtpCode entry={entry} isVisible={!isEditing && isVisibleCode} />
          {isEditing && <DragButton />}
        </Box>
        <CustomTypography entry={entry} property="account" />
        <Box sx={{ display: "flex", position: "absolute", bottom: 6, right: 8 }}>
          {!isEditing && <Countdown entry={entry} />}
        </Box>
      </Card>
      <AccountBypassDialog entry={entry} />
      {isEditing && (
        <ConfirmRemoveEntry entry={entry} isConfirmOpen={isConfirmOpen} setIsConfirmOpen={setIsConfirmOpen} />
      )}
      <ShowQR entry={entry} open={showQR} setOpen={setShowQR} />
    </Box>
  );
}

type CustomTypographyProps = {
  entry: OTPEntry;
  property: "issuer" | "account";
};

const CustomTypography = ({ entry, property }: CustomTypographyProps) => {
  const textValue = entry[property];

  const [isEditing] = useUrlHashState("#/edit");
  const { upsertEntryEdited } = useEntriesUtils();

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!["issuer", "account"].includes(name)) return;
    const newEntry = { ...entry, [name]: value };
    upsertEntryEdited(newEntry);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", height: 25 }}>
      {isEditing ? (
        <EditInputButton
          name={property}
          autoComplete="off"
          onChange={handleChangeValue}
          defaultValue={textValue as string}
        />
      ) : (
        <Typography
          title={textValue as string}
          color="text.secondary"
          sx={{
            ml: 0.7,
            width: 180,
            fontSize: 14,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {textValue}
        </Typography>
      )}
    </Box>
  );
};

const EditInputButton = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    fontSize: 14,
    width: "auto",
    borderRadius: 4,
    padding: "1px 5px",
    position: "relative",
    border: "1px solid",
    borderColor: theme.palette.mode === "light" ? "#E0E3E7" : "#2D3843",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const DragButton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <IconButton size="large" sx={{ position: "absolute" }}>
        <Tooltip title={t("dragEntry")} disableInteractive disableFocusListener>
          <DragHandleIcon sx={{ fontSize: 40 }} />
        </Tooltip>
      </IconButton>
    </Box>
  );
};
