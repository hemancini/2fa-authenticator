import { generateOTP } from "@src/entry/otp";
import { useEntries } from "@src/stores/useEntries";
import { create } from "zustand";

const getOTPCode = async (hash: string) => {
  const { entries } = useEntries.getState();
  const entry = entries.get(hash);
  if (!entry) return "••••••";
  const optCode = await generateOTP(entry);
  return optCode;
};

export const useOTPCodes = create<OTPCodesStore>((set) => ({
  otpCodes: new Map<string, OTPCodeType>(),
  updateOTPCode: async (hash: string) => {
    const otpCode = await getOTPCode(hash);
    set((state) => {
      state.otpCodes.set(hash, { otpCode });
      return { otpCodes: new Map(state.otpCodes) };
    });
  },
  getOTPCode,
}));
