import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import React, { useEffect, useState } from "react";

import { getAll, remove } from "../utils";

export default function storagePage() {
  const [value, setValue] = React.useState("0");
  const [storages, setStorage] = useState<unknown>();
  const [storageKeys, setStorageKeys] = useState<string[]>();

  const initGetAll = async () => {
    const allStorage = await getAll();
    if (allStorage) {
      setStorage(allStorage);
      const keys = Object.keys(allStorage);
      setStorageKeys(keys);
    }
  };

  useEffect(() => {
    (async () => await initGetAll())();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {storageKeys?.map((key, i) => (
              <Tab key={key} label={key} value={`${i}`} />
            ))}
          </TabList>
        </Box>
        {storageKeys?.map((key, i) => (
          <TabPanel key={key} value={`${i}`}>
            <button
              onClick={async () => {
                await remove(key);
                initGetAll();
              }}
            >
              X
            </button>
            <pre>{JSON.stringify(storages[key], null, 4)}</pre>
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
