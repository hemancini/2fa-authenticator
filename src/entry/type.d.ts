// totp url example: otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example

type OTPPeriod = 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39;
type OTPAlgorithm = "SHA1" | "SHA256" | "SHA512";
type OTPType = "totp" | "hotp";
type OTPDigits = 6 | 8;

interface Entry {
  issuer: string;
  account: string;
  secret: string;
  period: OTPPeriod;
  type: OTPType;
  digits: OTPDigits;
  algorithm: OTPAlgorithm;
  encrypted?: boolean;
  site?: string;
  user?: string;
  pass?: string;
}

interface OTPEntry extends Entry {
  hash: string;
}

export type TEntries = Map<string, OTPEntry>;

interface EntryState {
  entries: Map<string, OTPEntry>;
  setEntries: (entries: Map<string, OTPEntry>) => void;
  addEntry: (entry: OTPEntry) => void;
  removeEntry: (hash: string) => void;
  upsertEntry: (entry: OTPEntry) => void;
  framerReorder: (entries: OTPEntry[]) => void;
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

export {
  AddTypeOption,
  Entry,
  EntryState,
  OTPAlgorithm,
  OTPCodesStore,
  OTPCodeType,
  OTPDigits,
  OTPEntry,
  OTPPeriod,
  OTPType,
};

/**
 * @deprecated since version 1.3.0
 */
export interface OTPEntryLegacy {
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
