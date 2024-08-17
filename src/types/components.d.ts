type AddType =
  | "manual"
  | "random"
  | "scan-qr"
  | "totp-uri"
  | "import-backups"
  | "upload-qr-image"
  | "success"
  | "error"
  | undefined;

interface UseAddTypeProps {
  addType: AddType;
  setAddType: (value: AddType) => void;
  successMessage: string;
  setSuccessMessage: (value: string) => void;
}
