import { getOptionsStorage } from "@src/utils/options";

import { pasteCode } from "./pasteCode";

chrome.runtime.onMessage.addListener(async (request) => {
  const { autofillEnabled } = await getOptionsStorage();
  if (autofillEnabled && request.message === "pastecode") {
    const { code } = request.data;
    pasteCode(code);
  }
});
