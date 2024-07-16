import "@pages/panel/Panel.css";

import type { EntryState, OTPEntry } from "@src/otp/type";
import { useEntries } from "@src/stores/useEntries";
import React, { useEffect } from "react";

const getOptionsStorage = async () => {
  const chromeStorageKey = "2fa-options";
  const storage = await chrome.storage.local.get([chromeStorageKey]);
  return storage[chromeStorageKey]?.state;
};

const setOptionsStorage = async (data: any) => {
  const chromeStorageKey = "2fa-options";
  await chrome.storage.local.set({ [chromeStorageKey]: { state: data } });
};

const Debug = () => {
  const { entries: entries_v2 } = useEntries() as EntryState;

  const [entries, setEntries] = React.useState<any>();
  const [options, setOptions] = React.useState<any>();
  const [xraysEnabled, setXraysEnabled] = React.useState<boolean>(false);

  const handleXraysEnbledChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const _options = await getOptionsStorage();
    const optionsDraft = { ..._options, xraysEnabled: !xraysEnabled };
    await setOptionsStorage(optionsDraft).then(() => {
      setOptions(optionsDraft);
      setXraysEnabled(!xraysEnabled);
    });
  };

  useEffect(() => {
    (async () => {
      const storage = await chrome.storage.local.get();
      delete storage["LocalStorage"];
      delete storage["2fa-options"];
      delete storage["OPTIONS"];
      setEntries(storage);

      const _options = await getOptionsStorage();
      setOptions(_options);

      const { xraysEnabled } = _options;
      setXraysEnabled(xraysEnabled);
    })();
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => window.location.reload()}>refresh</button>
        <label>
          <input type="checkbox" checked={xraysEnabled} onChange={handleXraysEnbledChange} />
          X-rays
        </label>
      </div>
      <p>entries v2</p>
      <pre>{JSON.stringify(Array.from(entries_v2)?.flat(Infinity), null, 4)}</pre>
      <p>entries</p>
      <pre>{JSON.stringify(entries, null, 4)}</pre>
      <p>options</p>
      <pre>{JSON.stringify(options, null, 4)}</pre>
    </div>
  );
};

export default function Panel() {
  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <Debug />
    </div>
  );
}
