import { create } from "zustand";

import { generateOTP } from "../otp/entry";
import type { EntryState, OTPCodesStore, OTPCodeType } from "../otp/type";
import { useEntries } from "./useEntries";

const getOTPCode = (hash: string) => {
  const { entries } = useEntries.getState() as EntryState;
  const entry = entries.get(hash);
  if (!entry) return "••••••";
  const optCode = generateOTP(entry);
  return optCode;
};

export const useOTPCodes = create<OTPCodesStore>((set) => ({
  otpCodes: new Map<string, OTPCodeType>(),
  updateOTPCode: (hash: string) =>
    set((state) => {
      const otpCode = getOTPCode(hash);
      state.otpCodes.set(hash, { otpCode });
      return { otpCodes: state.otpCodes };
    }),
  getOTPCode,
}));
