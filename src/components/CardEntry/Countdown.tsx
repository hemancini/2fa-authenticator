import Box from "@mui/material/Box";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import useCountdown from "@src/hooks/useCountdown";
import type { OTPEntry } from "@src/otp/type";
import { useOptionsStore } from "@src/stores/useOptions";

export default function CountdownCircle({ entry }: { entry: OTPEntry }) {
  const { remainingTime, progress, currentColor, elapsedTime } = useCountdown({ entry });
  return (
    <CounterProgress
      size={28}
      value={progress}
      count={remainingTime}
      sx={{
        "& .MuiCircularProgress-circle": {
          transition: `stroke-dashoffset ${elapsedTime >= 1 ? 1 : 0.4}s ease-in-out`,
        },
        color: currentColor,
        scale: "-1 1",
      }}
    />
  );
}

export const CounterProgress = (props: CircularProgressProps & { count: number }) => {
  const { count } = props;
  const { isNewVersion } = useOptionsStore();
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" thickness={5} {...props} />
      <Box
        sx={{
          top: 0.25,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          position: "absolute",
          justifyContent: "center",
        }}
      >
        <Typography
          component="span"
          variant="caption"
          color="text.secondary"
          sx={{
            lineHeight: 1,
            fontSize: isNewVersion ? "0.90rem" : "0.70rem",
            fontWeight: isNewVersion ? "bold" : "normal",
          }}
        >
          {count}
        </Typography>
      </Box>
    </Box>
  );
};