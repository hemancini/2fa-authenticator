const chromeStorageKey = "2fa-options";

export const getOptionsStorage = async () => {
  return await chrome.storage.local.get([chromeStorageKey]).then((result) => result[chromeStorageKey]?.state);
};

export const setOptionsStorage = async (data: any) => {
  await chrome.storage.local.set({ [chromeStorageKey]: { state: data } });
};
