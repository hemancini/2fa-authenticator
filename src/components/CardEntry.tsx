import CounterProgress from "@components/CounterProgress";
import DialogQR from "@components/DialogQR";
import IconButtonResize from "@components/IconButtonResize";
import PersonIcon from "@mui/icons-material/Person";
import PushPinIcon from "@mui/icons-material/PushPin";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { Card, CardActionArea, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { OTPEntry } from "@src/models/otp";
import { useEffect, useState } from "react";

const issuerBypass = "WOM";

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
    <Card
      variant="outlined"
      onMouseOver={() => setShowOptions(true)}
      onMouseOut={() => setShowOptions(false)}
      sx={{ my: 1.7 }}
    >
      <CardContent sx={{ py: 0.3, pr: 0.3, pb: "0px !important" }}>
        <Box aria-label="issuer" display="flex">
          <Box
            sx={{
              py: 0.5,
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            <Typography sx={{ fontSize: 14 }} color="text.secondary">
              {entry.issuer}&nbsp;
            </Typography>
          </Box>
          <Box sx={{ display: showOptions ? "block" : "none" }}>
            {entry.issuer === issuerBypass && (
              <IconButtonResize mr={0.2}>
                <PersonIcon />
              </IconButtonResize>
            )}
            <IconButtonResize onClick={() => setShowQR(!showQR)}>
              <QrCode2Icon />
            </IconButtonResize>
            <IconButtonResize>
              <PushPinIcon />
            </IconButtonResize>
          </Box>
        </Box>
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
        <Box display="flex" position="relative" sx={{ mb: 1 }}>
          <Box aria-label="account" sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography sx={{ fontSize: 14, py: 0.5 }} color="text.secondary">
              {entry.account}&nbsp;
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "19%",
              right: "4%",
            }}
          >
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
        </Box>
      </CardContent>
      <DialogQR open={showQR} setOpen={setShowQR} />
    </Card>
  );
}
