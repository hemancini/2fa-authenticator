import { red } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { useOTPCodes } from "@src/stores/useOTPCodes";
import { useState } from "react";
import { useCountdown } from "react-countdown-circle-timer";

type ColorFormat = `#${string}` | `rgb(${string})` | `rgba(${string})` | `url(#${string})`;

export default function useCustomCountdown({ entry }: { entry: OTPEntry }) {
  const { hash, period } = entry;
  const { updateOTPCode } = useOTPCodes();

  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const [currentColor, setCurrentColor] = useState(primaryColor);

  const { countdown } = getCount(period);
  const countdownProps = useCountdown({
    isPlaying: true,
    duration: period,
    initialRemainingTime: countdown,
    colors: primaryColor as ColorFormat,
    onComplete: () => {
      updateOTPCode(hash);
      return { shouldRepeat: true, delay: 0 };
    },
  });

  const { remainingTime } = countdownProps;
  const progress = (remainingTime * 100) / period;

  if (remainingTime <= 5 && currentColor !== red[400]) setCurrentColor(red[400]);
  if (remainingTime > 5 && currentColor !== primaryColor) setCurrentColor(primaryColor);

  return { ...countdownProps, progress, currentColor };
}

const getCount = (startTime: number) => {
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const countdown = startTime - (epoch % startTime);
  return { epoch, countdown };
};
