import { generateOTP } from "@src/otp/entry";
import type { EntryState, OTPCodesStore, OTPCodeType } from "@src/otp/type";
import { create } from "zustand";

import { useEntries } from "./useEntries";

const getOTPCode = (hash: string) => {
  const { entries } = useEntries.getState();
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
