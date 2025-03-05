type OTPPeriod = 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39;
type OTPAlgorithm = "SHA1" | "SHA256" | "SHA512";
type OTPType = "totp" | "hotp";
type OTPDigits = 6 | 8;

interface TEntry {
  issuer: string;
  account: string;
  secret: string;
  period: OTPPeriod;
  type: OTPType;
  digits: OTPDigits;
  algorithm: OTPAlgorithm;
  encrypted?: boolean;
  isVisible?: boolean;
  site?: string;
  user?: string;
  pass?: string;
  totpURI?: string;
}

interface OTPEntry extends TEntry {
  hash: string;
}

type TEntries = Map<string, OTPEntry>;

interface EntryState {
  entries: TEntries;
  setEntries: (entries: Map<string, OTPEntry>) => void;
  addEntry: (entry: OTPEntry) => void;
  removeEntry: (hash: string) => void;
  upsertEntry: (entry: OTPEntry) => void;
  framerReorder: (entries: OTPEntry[]) => void;
  toggleVisible: (hash: string) => void;
  toggleVisibleTokens: () => void;
  /**
   * @deprecated since version 1.3.0
   */
  removeAll?: () => void;
}

type AddTypeOption = "qr-image" | "qr-scanner" | "url" | "manual" | "random";

type OTPCodeType = {
  otpCode: string;
};

interface OTPCodesStore {
  otpCodes: Map<string, OTPCodeType>;
  updateOTPCode: (hash: string) => void;
  getOTPCode: (hash: string) => string;
}

/**
 * @deprecated since version 1.3.0
 */
interface OTPEntryLegacy {
  type: OTPType | number;
  index: number;
  issuer: string;
  secret: string | null;
  encSecret: string | null;
  account: string;
  hash: string;
  counter: number;
  period: number;
  digits: number;
  algorithm: OTPAlgorithm | number;
  pinned: boolean;
  code: string;
  site: string;
  user: string;
  pass: string;
}
