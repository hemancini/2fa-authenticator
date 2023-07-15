import Box from "@mui/material/Box";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function CounterProgress(props: CircularProgressProps & { value: number } & { count: number }) {
  const { count } = props;
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" thickness={5} {...props} />
      <Box
        sx={{
          top: 0,
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
          component="div"
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: 1, fontSize: "0.70rem" }}
        >
          {count}
        </Typography>
      </Box>
    </Box>
  );
}
