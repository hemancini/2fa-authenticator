import CounterProgress from "@components/CounterProgress";
import DialogQR from "@components/DialogQR";
import IconButtonResize from "@components/IconButtonResize";
import PersonIcon from "@mui/icons-material/Person";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { Card, CardActionArea, CardContent } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { OTPEntry } from "@src/models/otp";
import { ReactNode, useEffect, useState } from "react";

const issuerBypass = "WOM";

const BoxRelative = (props: BoxProps & { children: ReactNode }) => {
  const { children } = props;
  return (
    <Box py={0.2} pl={0.2} display="flex" position="relative" {...props}>
      {children}
    </Box>
  );
};

export default function OutlinedCard({ entry, count, discount }: { entry: OTPEntry; count: number; discount: number }) {
  const period = entry?.period || 30;
  const initProgress = 100 - (count * 100) / period;

  const [showQR, setShowQR] = useState(false);
  const [progress, setProgress] = useState(initProgress);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setProgress((prevProgress) => (count > 1 ? prevProgress - 1 * 3.33 : 100));
  }, [count]);

  return (
    <>
      <Card
        variant="outlined"
        onMouseOver={() => setShowOptions(true)}
        onMouseOut={() => setShowOptions(false)}
        sx={{ my: 1.7 }}
      >
        <CardContent sx={{ py: 0.3, px: 1.2, "&:last-child": { pb: 0.3 } }}>
          <BoxRelative>
            <Box aria-label="issuer" mt={0.3}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                {entry.issuer}&nbsp;
              </Typography>
            </Box>
            <Box display={showOptions ? "flex" : "none"} position="absolute" right={-5}>
              {entry.issuer === issuerBypass && (
                <IconButtonResize>
                  <PersonIcon />
                </IconButtonResize>
              )}
              <IconButtonResize onClick={() => setShowQR(!showQR)}>
                <QrCode2Icon />
              </IconButtonResize>
            </Box>
          </BoxRelative>
          <Box aria-label="otp-code" display="flex">
            <CardActionArea>
              <Typography
                className={discount <= 3 && "parpadea"}
                sx={{
                  color: discount <= 3 ? "red" : blue[500],
                  fontWeight: "bold",
                  fontSize: "1.9rem",
                  letterSpacing: 4,
                  lineHeight: 1,
                }}
              >
                {entry.code}
              </Typography>
            </CardActionArea>
            <Box sx={{ minWidth: "100%" }} />
          </Box>
          <BoxRelative mb={0.3}>
            <Box aria-label="account" display="flex">
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                {entry.account}&nbsp;
              </Typography>
            </Box>
            <Box display="flex" position="absolute" bottom={5} right={-1}>
              <CounterProgress
                size={25}
                count={discount}
                value={progress}
                sx={{
                  color: discount <= 5 && "red",
                  scale: "-1 1",
                }}
              />
            </Box>
          </BoxRelative>
        </CardContent>
      </Card>
      <DialogQR entry={entry} open={showQR} setOpen={setShowQR} />
    </>
  );
}
