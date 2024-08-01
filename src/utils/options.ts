import { CHROME_STORAGE_AREA, STORAGE_ENTRIES_KEY } from "@src/config";

export const getOptionsStorage = async (): Promise<OptionsInterface> => {
  return await chrome.storage[CHROME_STORAGE_AREA].get([STORAGE_ENTRIES_KEY]).then(
    (result) => result[STORAGE_ENTRIES_KEY]?.state
  );
};

export const setOptionsStorage = async (data: unknown) => {
  await chrome.storage[CHROME_STORAGE_AREA].set({ [STORAGE_ENTRIES_KEY]: { state: data } });
};

export async function syncTimeWithGoogle() {
  const req = await fetch("https://www.google.com/generate_204");
  const date = req.headers.get("date");
  if (!date) throw new Error("updateFailure");

  const clientTime = new Date().getTime();
  const serverTime = new Date(date).getTime();
  const offset = Math.round((serverTime - clientTime) / 1000);
  // console.log("serverDate:", date);
  // console.log("clientDate:", new Date());
  // console.log("serverTime:", serverTime);
  // console.log("clientTime:", clientTime);
  // console.log("offset:", offset);

  if (Math.abs(offset) <= 300) {
    // within 5 minutes
    localStorage.offset = Math.round((serverTime - clientTime) / 1000);
    return "updateSuccess";
  }
  return "clock_too_far_off";
}
