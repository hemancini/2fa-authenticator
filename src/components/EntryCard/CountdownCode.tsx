import type { OTPEntry } from "@src/otp/type";
import { useOTPCodes } from "@src/stores/useOTPCodes";

export default function CountdownCode({ entry: { hash }, isVisible }: { entry: OTPEntry; isVisible: boolean }) {
  const { otpCodes, getOTPCode } = useOTPCodes();

  let optCode = otpCodes.get(hash)?.otpCode;
  if (!optCode) optCode = getOTPCode(hash);

  return <>{isVisible ? optCode : "••••••"}</>;
}
