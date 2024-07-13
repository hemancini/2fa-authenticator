import CounterProgress from "@components/CounterProgress";
import { red } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import type { OTPEntry } from "@src/otp/type";
import { useOTPCodes } from "@src/stores/useOTPCodes";
import { useCountdown } from "react-countdown-circle-timer";

type ColorFormat = `#${string}` | `rgb(${string})` | `rgba(${string})` | `url(#${string})`;

const getCount = (startTime: number) => {
  const epoch = Math.round(new Date().getTime() / 1000.0);
  const countDown = startTime - (epoch % startTime);
  return { epoch, countDown };
};

export default function CountDownCircle({ entry: { hash, period } }: { entry: OTPEntry }) {
  const { updateOTPCode } = useOTPCodes();

  const onComplete = () => {
    const $optCode = document.querySelector(`[data-hash="${hash}"]`);
    $optCode?.classList.remove("parpadeo");
    updateOTPCode(hash);
  };

  const { countDown } = getCount(period);

  const theme = useTheme();
  const primaryColor = theme.palette.primary.main as ColorFormat;

  const { remainingTime } = useCountdown({
    isPlaying: true,
    duration: period,
    initialRemainingTime: countDown,
    onComplete: () => {
      onComplete?.();
      return { shouldRepeat: true, delay: 0 };
    },
    colors: primaryColor,
  });

  return (
    <CounterProgress
      size={30}
      count={remainingTime}
      value={(remainingTime * 100) / period}
      sx={{
        "& .MuiCircularProgress-circle": {
          transition: `stroke-dashoffset ${period - remainingTime >= 1 ? 1 : 0.4}s ease-in-out`,
        },
        color: remainingTime <= 5 && red[400],
        scale: "-1 1",
      }}
    />
  );
}
