import { useEffect } from "react";

import { type StorageAreas, useStorageAreas } from "../../stores/useStorageAreas";
import DataList from "./DataList";

export default function storagePage() {
  const { setAllData } = useStorageAreas();

  const initGetAll = async () => {
    const storageAreas: StorageAreas = { local: [], sync: [], session: [] };
    await Promise.all(
      Object.keys(storageAreas).map(async (area) => {
        const data = await chrome.storage[area].get(null);
        storageAreas[area] = data;
        return data;
      })
    );
    // console.log(storageAreas);
    setAllData(storageAreas);
  };

  useEffect(() => {
    (async () => await initGetAll())();
  }, []);

  return <DataList />;
}
