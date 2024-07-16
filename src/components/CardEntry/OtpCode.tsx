import { Typography } from "@mui/material";
import type { OTPEntry } from "@src/otp/type";
import { useOTPCodes } from "@src/stores/useOTPCodes";

export default function OtpCode({ entry: { hash }, isVisible }: { entry: OTPEntry; isVisible: boolean }) {
  const { otpCodes, getOTPCode } = useOTPCodes();

  let optCode = otpCodes.get(hash)?.otpCode;
  if (!optCode) optCode = getOTPCode(hash);

  return (
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
  );
}
