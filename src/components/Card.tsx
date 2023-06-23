import DialogQR from "@components/DialogQR";
import PersonIcon from "@mui/icons-material/Person";
import PushPinIcon from "@mui/icons-material/PushPin";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { Card, CardActionArea, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CounterProgress from "@src/components/CounterProgress";
import { ReactNode, useEffect, useState } from "react";

function IconButtonCard(props: IconButtonProps & { children: ReactNode } & { mr?: number }) {
  const { children, mr } = props;
  const iconSize = 29;
  return (
    <IconButton {...props} sx={{ height: iconSize, width: iconSize, mr }}>
      {children}
    </IconButton>
  );
}

export default function OutlinedCard() {
  const [showQR, setShowQR] = useState(false);

  const [count, setCount] = useState(30);
  const [numero, setNumero] = useState("");
  const [progress, setProgress] = useState(100);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const generarOTP = () => {
      const nuevoNumero = Math.floor(Math.random() * 900000) + 100000;
      setNumero(nuevoNumero.toString());
    };
    generarOTP();

    const timerCount = setInterval(() => {
      setCount((prevCount) => {
        setProgress((prevProgress) => (prevCount > 1 ? prevProgress - 1 * 3.33 : 100));
        if (prevCount === 1) {
          generarOTP();
          return 30;
        } else {
          return prevCount - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerCount);
    };
  }, []);
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
              ISSUER
            </Typography>
          </Box>
          <Box sx={{ display: showOptions ? "block" : "none" }}>
            <IconButtonCard mr={0.5}>
              <PersonIcon />
            </IconButtonCard>
            <IconButtonCard onClick={() => setShowQR(!showQR)}>
              <QrCode2Icon />
            </IconButtonCard>
            <IconButtonCard>
              <PushPinIcon />
            </IconButtonCard>
          </Box>
        </Box>
        <Box aria-label="otp-code" display="flex">
          <CardActionArea>
            <Typography
              className={count <= 3 && "parpadea"}
              sx={{
                color: count <= 3 ? "red" : blue[500],
                fontWeight: "bold",
                fontSize: "1.9rem",
                letterSpacing: 4,
                lineHeight: 1,
              }}
            >
              {numero}
            </Typography>
          </CardActionArea>
          <Box sx={{ minWidth: "100%" }} />
        </Box>
        <Box aria-label="account" display="flex" position="relative">
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography sx={{ fontSize: 14, py: 0.5 }} color="text.secondary">
              35942-17317
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "20%",
              right: "3%",
            }}
          >
            <CounterProgress
              value={progress}
              count={count}
              sx={{
                color: count <= 5 && "red",
                scale: "-1 1",
                height: "30px !important",
                width: "30px !important",
              }}
            />
          </Box>
        </Box>
      </CardContent>
      <DialogQR open={showQR} setOpen={setShowQR} />
    </Card>
  );
}
