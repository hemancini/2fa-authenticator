import DialogQR from "@components/DialogQR";
import { Box, Card } from "@mui/material";
import Typography, { TypographyProps } from "@mui/material/Typography";
import type { OTPEntry } from "@src/otp/type";
import { useOptionsStore } from "@src/stores/useOptions";
import { useEffect, useState } from "react";

import CountDownCircleTimer from "./CountdownCircleTimer";
import CountdownCode from "./CountdownCode";
import CardUtils from "./Utils";

export default function EntryCard({ entry }: { entry: OTPEntry }) {
  const { bypassEnabled, isVisibleCodes } = useOptionsStore();
  const { hash, issuer, account } = entry;

  const [showQR, setShowQR] = useState(false);
  const [showUtils, setShowUtils] = useState(false);
  const [isVisibleCode, setVisibleCode] = useState(isVisibleCodes);

  useEffect(() => {
    setVisibleCode(isVisibleCodes);
  }, [isVisibleCodes]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 0,
          position: "relative",
          transition: "all 0.3s ease",
          "&:hover": { filter: "brightness(0.96)" },
        }}
        onMouseOver={() => setShowUtils(true)}
        onMouseOut={() => setShowUtils(false)}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CustomTypography>{issuer ?? " "}</CustomTypography>
          <CardUtils
            showQR={showQR}
            setShowQR={setShowQR}
            showCardUtils={showUtils}
            isVisibleCode={isVisibleCode}
            setVisibleCode={setVisibleCode}
          />
          <Typography
            component={"h5"}
            data-hash={hash}
            sx={{
              letterSpacing: 4,
              fontWeight: "bold",
              color: "primary.main",
              fontSize: isVisibleCode ? "1.9rem" : "3rem",
              lineHeight: isVisibleCode ? 1 : 0.6,
            }}
          >
            <CountdownCode entry={entry} isVisible={isVisibleCode} />
          </Typography>
          <CustomTypography>{account ?? " "}</CustomTypography>
          <Box sx={{ display: "flex", position: "absolute", bottom: 6, right: 8 }}>
            <CountDownCircleTimer entry={entry} />
          </Box>
        </Box>
      </Card>
      <DialogQR entry={entry} open={showQR} setOpen={setShowQR} />
    </>
  );
}

function CustomTypography({ children, ...props }: TypographyProps) {
  return (
    <Typography
      title={children as string}
      color="text.secondary"
      sx={{
        fontSize: 14,
        maxWidth: 180,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
