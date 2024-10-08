import { CardActionArea, Fade, Tooltip as MuiTooltip, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { t } from "@src/chrome/i18n";
import { sendMessageToBackground } from "@src/chrome/message";
import useCountdown from "@src/hooks/useCountdown";
import useUrlHashState from "@src/hooks/useUrlHashState";
import { useOptionsStore } from "@src/stores/useOptions";
import { useOTPCodes } from "@src/stores/useOTPCodes";
import { useState } from "react";

export default function OtpCode({ entry, isVisible }: { entry: OTPEntry; isVisible: boolean }) {
  const { hash } = entry;
  const { autofillEnabled } = useOptionsStore();
  const { otpCodes, getOTPCode } = useOTPCodes();
  const [isToolpipCopyOpen, setToolpipCopyOpen] = useState(false);
  const [isEditing] = useUrlHashState("#/edit");

  let optCode = otpCodes.get(hash)?.otpCode;
  if (!optCode) optCode = getOTPCode(hash);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(optCode).then(() => {
      setToolpipCopyOpen(true);
      setTimeout(() => setToolpipCopyOpen(false), 1000);
      handleAutoFill(optCode);
    });
  };

  const handleAutoFill = (code: string) => {
    if (autofillEnabled && code) {
      return new Promise((resolve, reject) => {
        sendMessageToBackground({
          message: { type: "autofill", data: { code } },
        });
      });
    }
  };

  return (
    <MuiTooltip
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      open={isToolpipCopyOpen}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={t("copied")}
      disableInteractive
      placement="right"
      arrow
    >
      <CardActionArea disabled={isEditing} onClick={handleCopyCode} sx={{ borderRadius: 2, width: "auto" }}>
        <CustomTypography entry={entry} isVisible={isVisible} optCode={optCode} isEditing={isEditing} />
      </CardActionArea>
    </MuiTooltip>
  );
}

const CustomTypography = ({
  entry,
  optCode,
  isVisible,
  isEditing,
}: {
  entry: OTPEntry;
  optCode: string;
  isVisible: boolean;
  isEditing: boolean;
}) => {
  const { currentColor, remainingTime } = useCountdown({ entry });
  const isParpadeando = remainingTime <= 5;
  return (
    <Typography
      component={"h5"}
      sx={(theme) => ({
        ml: 0.5,
        height: 31,
        display: "flex",
        alignItems: "center",
        letterSpacing: 4,
        fontWeight: "bold",
        color: currentColor === "#fafafa" ? grey[400] : !isEditing ? currentColor : theme.palette.primary.main,
        fontSize: isVisible ? "1.9rem" : "3rem",
        lineHeight: isVisible ? 1 : 0.6,
      })}
      className={isParpadeando && !isEditing ? "parpadea" : ""}
    >
      {isVisible ? optCode : "••••••"}
    </Typography>
  );
};
