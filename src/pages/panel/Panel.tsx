import "@pages/panel/Panel.css";

import { useEntries } from "@src/stores/useEntries";
import { getOptionsStorage, setOptionsStorage } from "@src/utils/options";
import React, { useEffect } from "react";

const Debug = () => {
  const { entries } = useEntries();

  const [options, setOptions] = React.useState<any>();
  const [xraysEnabled, setXraysEnabled] = React.useState<boolean>(false);

  const handleXraysEnbledChange = async () => {
    const _options = await getOptionsStorage();
    const optionsDraft = { ..._options, xraysEnabled: !xraysEnabled };
    await setOptionsStorage(optionsDraft).then(() => {
      setOptions(optionsDraft);
      setXraysEnabled(!xraysEnabled);
    });
  };

  useEffect(() => {
    (async () => {
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
      <p>entries</p>
      <pre>{JSON.stringify(Array.from(entries)?.flat(Infinity), null, 2)}</pre>
      <p>options</p>
      <pre>{JSON.stringify(options, null, 2)}</pre>
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
