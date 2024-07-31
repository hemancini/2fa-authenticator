import { TabContext, TabPanel } from "@mui/lab";
import { Box, Divider, Tab, Tabs } from "@mui/material";
import { getAll, remove } from "@src/chrome/localStorage";
import React, { useEffect, useState } from "react";
import superjson from "superjson";

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
          <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
            {storageKeys?.map((key, i) => (
              <Tab key={key} label={key} value={`${i}`} sx={{ textTransform: "none" }} wrapped />
            ))}
          </Tabs>
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
            <pre>{JSON.stringify(storages[key], null, 2)}</pre>
            {key === "entries" && (
              <>
                <Divider />
                <pre>{JSON.stringify(JSON.parse(superjson.stringify(superjson.parse(storages[key]))), null, 2)}</pre>
              </>
            )}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
