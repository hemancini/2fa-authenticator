import AccountBypassDialog from "@components/dialogs/AccountBypass";
import ConfirmRemoveEntry from "@components/dialogs/ConfirmRemoveEntry";
import ShowQR from "@components/dialogs/ShowQR";
import Tooltip from "@components/Tooltip";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Box, Card, InputBase } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { t } from "@src/chrome/i18n";
import useUrlHashState from "@src/hooks/useUrlHashState";
import type { OTPEntry } from "@src/otp/type";
import { useOptionsStore } from "@src/stores/useOptions";
import { useEffect, useState } from "react";

import CountDownCircleTimer from "./CountdownCircleTimer";
import OtpCode from "./OtpCode";
import CardUtils from "./Utils";

export default function EntryCard({ entry }: { entry: OTPEntry }) {
  const { isVisibleCodes } = useOptionsStore();
  const [isEditing] = useUrlHashState("#/edit");
  const { issuer, account } = entry;

  const [showQR, setShowQR] = useState(false);
  const [showUtils, setShowUtils] = useState(false);
  const [isVisibleCode, setVisibleCode] = useState(isVisibleCodes);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    setVisibleCode(isVisibleCodes);
  }, [isVisibleCodes]);

  const handleRemoveEntry = (hash: string) => {
    // const index = entriesEdited.findIndex((entry) => entry.hash === hash);
    // entriesEdited.splice(index, 1);
    // setEntriesEdited(entriesEdited);
    // setIsConfirmOpen(false);
    // handleRender((prevState) => !prevState);
  };

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
          transition: "all 0.3s ease",
          "&:hover": { filter: "brightness(0.96)" },
          // borderRadius: 0,
        }}
        onMouseOver={() => setShowUtils(true)}
        onMouseOut={() => setShowUtils(false)}
      >
        <CustomTypography>{issuer}</CustomTypography>
        {!isEditing && (
          <CardUtils {...{ entry, showQR, setShowQR, showCardUtils: showUtils, isVisibleCode, setVisibleCode }} />
        )}
        <Box sx={{ display: "flex", gap: 4 }}>
          <OtpCode entry={entry} isVisible={!isEditing && isVisibleCode} />
          {isEditing && <DragButton />}
        </Box>
        <CustomTypography>{account}</CustomTypography>
        <Box sx={{ display: "flex", position: "absolute", bottom: 6, right: 8 }}>
          {!isEditing && <CountDownCircleTimer entry={entry} />}
        </Box>
      </Card>
      <AccountBypassDialog entry={entry} />
      {isEditing && (
        <ConfirmRemoveEntry
          entry={entry}
          isConfirmOpen={isConfirmOpen}
          setIsConfirmOpen={setIsConfirmOpen}
          handleRemoveEntry={handleRemoveEntry}
        />
      )}
      <ShowQR entry={entry} open={showQR} setOpen={setShowQR} />
    </Box>
  );
}

const CustomTypography = ({ children, ...props }: TypographyProps) => {
  const [isEditing] = useUrlHashState("#/edit");
  return (
    <Box sx={{ display: "flex", alignItems: "center", height: 25 }}>
      {isEditing ? (
        <EditButton defaultValue={children as string} />
      ) : (
        <Typography
          title={children as string}
          color="text.secondary"
          sx={{
            ml: 0.7,
            width: 180,
            fontSize: 14,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          {...props}
        >
          {children}
        </Typography>
      )}
    </Box>
  );
};

const EditButton = styled(InputBase)(({ theme }) => ({
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
