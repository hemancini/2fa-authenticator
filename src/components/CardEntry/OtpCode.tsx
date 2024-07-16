import { CardActionArea, Fade, Tooltip as MuiTooltip, Typography } from "@mui/material";
import { t } from "@src/chrome/i18n";
import useUrlHashState from "@src/hooks/useUrlHashState";
import type { OTPEntry } from "@src/otp/type";
import { useOTPCodes } from "@src/stores/useOTPCodes";
import { useState } from "react";

export default function OtpCode({ entry: { hash }, isVisible }: { entry: OTPEntry; isVisible: boolean }) {
  const { otpCodes, getOTPCode } = useOTPCodes();
  const [isToolpipCopyOpen, setToolpipCopyOpen] = useState(false);
  const [isEditing] = useUrlHashState("#/edit");

  let optCode = otpCodes.get(hash)?.otpCode;
  if (!optCode) optCode = getOTPCode(hash);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(optCode).then(() => {
      setToolpipCopyOpen(true);
      setTimeout(() => setToolpipCopyOpen(false), 1000);
      // handleAutoFill();
    });
  };

  return (
    <CardActionArea disabled={isEditing} onClick={handleCopyCode} sx={{ borderRadius: 2, width: "auto" }}>
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
        <Typography
          component={"h5"}
          data-hash={hash}
          sx={{
            ml: 0.5,
            height: 31,
            display: "flex",
            alignItems: "center",
            letterSpacing: 4,
            fontWeight: "bold",
            color: "primary.main",
            fontSize: isVisible ? "1.9rem" : "3rem",
            lineHeight: isVisible ? 1 : 0.6,
          }}
        >
          {isVisible ? optCode : "••••••"}
        </Typography>
      </MuiTooltip>
    </CardActionArea>
  );
}
