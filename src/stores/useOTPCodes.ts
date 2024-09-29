import { generateOTP } from "@src/entry/otp";
import { useEntries } from "@src/stores/useEntries";
import { create } from "zustand";

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
