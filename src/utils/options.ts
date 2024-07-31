const chromeStorageKey = "2fa-options";

export const getOptionsStorage = async (): Promise<OptionsInterface> => {
  return await chrome.storage.local.get([chromeStorageKey]).then((result) => result[chromeStorageKey]?.state);
};

export const setOptionsStorage = async (data: unknown) => {
  await chrome.storage.local.set({ [chromeStorageKey]: { state: data } });
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
