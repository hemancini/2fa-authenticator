import "@pages/panel/Panel.css";

import React, { useEffect } from "react";

const Debug = () => {
  const [entries, setEntries] = React.useState<any>();
  const [options, setOptions] = React.useState<any>();
  const [xraysEnabled, setXraysEnabled] = React.useState<boolean>(false);

  const handleXraysEnbledChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = options;
    data.xraysEnabled = event.target.checked;
    await chrome.storage.local.set({ OPTIONS: data }).then(() => {
      setOptions(data);
      setXraysEnabled(data.xraysEnabled);
    });
  };

  useEffect(() => {
    (async () => {
      const storage = await chrome.storage.local.get();
      const { OPTIONS } = storage;
      delete storage["LocalStorage"];
      delete storage["OPTIONS"];

      setEntries(storage);
      setOptions(OPTIONS);
      setXraysEnabled(OPTIONS.xraysEnabled);
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
      <p>entries</p>
      <pre>{JSON.stringify(entries, null, 4)}</pre>
      <p>options</p>
      <pre>{JSON.stringify(options, null, 4)}</pre>
    </div>
  );
};

const Panel: React.FC = () => {
  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <Debug />
    </div>
  );
};

export default Panel;
