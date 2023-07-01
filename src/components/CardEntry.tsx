import CounterProgress from "@components/CounterProgress";
import DialogQR from "@components/DialogQR";
import IconButtonResize from "@components/IconButtonResize";
import PersonIcon from "@mui/icons-material/Person";
import PushPinIcon from "@mui/icons-material/PushPin";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { Card, CardActionArea, CardContent } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { blue } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import EntriesContext from "@src/contexts/Entries";
import { OTPEntry } from "@src/models/otp";
import { ReactNode, useContext, useEffect, useState } from "react";

const issuerBypass = "WOM";

const BoxRelative = (props: BoxProps & { children: ReactNode }) => {
  const { children } = props;
  return (
    <Box py={0.2} pl={0.2} display="flex" position="relative" {...props}>
      {children}
    </Box>
  );
};

export default function OutlinedCard({ entry }: { entry: OTPEntry }) {
  const { second, updateEntriesState } = useContext(EntriesContext);

  const period = entry?.period || 30;

  const count = second % period;
  const discount = period - (second % period);
  const initProgress = 100 - (count * 100) / period;

  const [showQR, setShowQR] = useState(false);
  const [progress, setProgress] = useState(initProgress);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setProgress((prevProgress) => (count > 0 ? prevProgress - 1 * (100 / period) : 100));
  }, [second]);

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
            <Box aria-label="issuer" mt={0.3} maxWidth="80%">
              <Typography noWrap sx={{ fontSize: 14 }} color="text.secondary">
                {entry.issuer || <span>&nbsp;</span>}
              </Typography>
            </Box>
            <Box position="absolute" right={-7} display="flex">
              <Box display={showOptions ? "block" : "none"}>
                {entry.issuer === issuerBypass && (
                  <IconButtonResize mr={0.3}>
                    <PersonIcon />
                  </IconButtonResize>
                )}
                <IconButtonResize onClick={() => setShowQR(!showQR)}>
                  <QrCode2Icon />
                </IconButtonResize>
              </Box>
              <Box display={showOptions || entry.pinned ? "block" : "none"}>
                <IconButtonResize
                  onClick={async () => {
                    entry.index = !entry.pinned ? -1 : entry.index;
                    entry.pinned = !entry.pinned;
                    await entry.update();
                    updateEntriesState("all");
                  }}
                >
                  <PushPinIcon
                    sx={{
                      fontSize: !showOptions && entry.pinned && 16,
                      transform: !entry.pinned && "rotate(40deg)",
                      color: (theme) => entry.pinned && !showOptions && theme.palette.text.disabled,
                    }}
                  />
                </IconButtonResize>
              </Box>
            </Box>
          </BoxRelative>
          <Box aria-label="otp-code" display="flex">
            <CardActionArea onClick={() => navigator.clipboard.writeText(entry.code)}>
              <Typography
                className={discount <= 3 && "parpadea"}
                sx={{
                  color: discount <= 3 ? "red" : (theme) => theme.palette.primary.main,
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
            <Box aria-label="account" display="flex" maxWidth="80%">
              <Typography noWrap sx={{ fontSize: 14 }} color="text.secondary">
                {entry.account || <span>&nbsp;</span>}
              </Typography>
            </Box>
            <Box display="flex" position="absolute" bottom={5} right={0}>
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
