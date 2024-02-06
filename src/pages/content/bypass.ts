import { decrypData } from "@src/models/encryption";
import { OTPEntry } from "@src/models/otp";
import { EntryStorage } from "@src/models/storage";

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.message === "bypass") {
    const chromeStorageKey = "2fa-options";
    const bypassEnabled = await chrome.storage.local.get([chromeStorageKey]).then((result) => result[chromeStorageKey]?.state?.bypassEnabled);
    /** @deprecated This constant is deprecate. Use `chromeStorageKey` new instead. */
    const chromeStorageKeyDeprecated = "OPTIONS";
    /** @deprecated This constant is deprecate. Use `bypassEnabled` new instead. */
    const bypassEnabledDeprecated = await chrome.storage.local.get([chromeStorageKeyDeprecated]).then((result) => result[chromeStorageKeyDeprecated]?.bypassEnabled);
    if (bypassEnabled || bypassEnabledDeprecated) {
      const entries = await EntryStorage.get();
      const filter = entries.filter(
        (entry) => entry?.site?.includes(location.host) && entry?.user !== "" && entry?.pass !== ""
      );
      const entry = filter?.[0];
      if (entry?.site?.includes(request?.data)) {
        autoLoginEntrust(entry);
      }
    }
  }
});

const autoLoginEntrust = async (entry: OTPEntry) => {
  let iteration = 0;
  let intervalOTP = undefined;
  let intervalOptions = undefined;
  let intervalPassword = undefined;
  let intervalOptionsList = undefined;
  const intervalMilliseconds = 500;

  const setUserId = () => {
    iteration++;
    console.log("setUserId");
    const userIdInput = document.getElementById("userId");
    if (userIdInput) {
      userIdInput.click();
      document.execCommand("selectAll", false, undefined);
      document.execCommand("delete", false, undefined);
      document.execCommand("insertText", false, decrypData(entry.user));
      const nextButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (nextButton) nextButton.click();
      iteration = 0;
      clearInterval(intervalUserId);
      intervalPassword = setInterval(setPassword, intervalMilliseconds);
    } else if (iteration > 10) {
      iteration = 0;
      clearInterval(intervalUserId);
      console.log("setUserId - iteration > 10");
      intervalPassword = setInterval(setPassword, intervalMilliseconds);
    }
  };

  const setPassword = () => {
    iteration++;
    console.log("setPassword");
    const otpInput = document.getElementById("otp");
    if (otpInput) {
      otpInput.click();
      document.execCommand("insertText", false, decrypData(entry.pass));
      const nextButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (nextButton) nextButton.click();
      iteration = 0;
      clearInterval(intervalPassword);
      intervalOptions = setInterval(selectOptions, intervalMilliseconds);
    } else if (iteration > 10) {
      iteration = 0;
      clearInterval(intervalPassword);
      console.log("setPassword - iteration > 10");
      intervalOptions = setInterval(selectOptions, intervalMilliseconds);
    }
  };

  const selectOptions = () => {
    iteration++;
    console.log("selectOptions");
    const options = document.getElementById("alternative-authenticators");
    if (options) {
      options.click();
      iteration = 0;
      clearInterval(intervalOptions);
      intervalOptionsList = setInterval(selectOptionsList, intervalMilliseconds);
    } else if (iteration > 10) {
      iteration = 0;
      clearInterval(intervalOptions);
      console.log("selectOptions - iteration > 10");
      intervalOptionsList = setInterval(selectOptionsList, intervalMilliseconds);
    }
  };

  const selectOptionsList = () => {
    iteration++;
    console.log("selectOptionsList");
    const optionsList = document.getElementById("change-authenticator-TOKEN");
    if (optionsList) {
      optionsList.click();
      iteration = 0;
      clearInterval(intervalOptionsList);
      intervalOTP = setInterval(setOTP, intervalMilliseconds);
    } else if (iteration > 10) {
      iteration = 0;
      clearInterval(intervalOptionsList);
      console.log("selectOptionsList - iteration > 10");
      intervalOTP = setInterval(setOTP, intervalMilliseconds);
    }
  };

  const setOTP = () => {
    iteration++;
    console.log("setOTP");
    const otpInput = document.getElementById("otp");
    if (otpInput) {
      otpInput.click();
      document.execCommand("insertText", false, entry.code);
      const nextButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (nextButton) nextButton.click();
      iteration = 0;
      clearInterval(intervalOTP);
    } else if (iteration > 10) {
      iteration = 0;
      clearInterval(intervalOTP);
      console.log("setOTP - iteration > 10");
    }
  };

  const intervalUserId = setInterval(setUserId, 500);
};
