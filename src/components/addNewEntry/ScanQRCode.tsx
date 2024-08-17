import CustomItemButton from "@components/Options/CustomItemButton";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { sendMessageToBackgroundAsync } from "@src/chrome/message";
import { useLocation } from "wouter";

import { useAddType } from "./useAddType";

export function ScanQRCodeButton() {
  const [location, setLocation] = useLocation();
  const { setAddType, setSuccessMessage } = useAddType();

  const getScanQRCode = async (): Promise<string | void> => {
    try {
      const status = await sendMessageToBackgroundAsync({ type: "captureQR" });
      if (status === "received") window.close();
    } catch (error) {
      setAddType("error");
      setSuccessMessage(error?.message);
    }
  };

  const handleScanQRCode = async () => {
    const response = await getScanQRCode();
    if (response) {
      alert(JSON.stringify(response, null, 2));
      if (location !== "/") setLocation("/");
    }
  };

  return (
    <CustomItemButton
      primary={"Scan QR Code"}
      toolltip={"Scan QR Code"}
      handleButton={handleScanQRCode}
      icon={<QrCodeScannerIcon />}
      disableLeftPadding
    />
  );
}
