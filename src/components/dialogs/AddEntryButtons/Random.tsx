import { Box, Button } from "@mui/material";
import type { EntryState } from "@src/otp/type";
import { useModalStore } from "@src/stores/useDynamicStore";
import { chromePersistStorage, useEntries } from "@src/stores/useEntries";
import { getRandomEntry } from "@src/utils/entry";
import superjson from "superjson";
import { StorageValue } from "zustand/middleware";

import draft from "../../../../docs/draft.json";

const isDev = import.meta.env.VITE_IS_DEV === "true";

export default function AddRandom() {
  const { addEntry, removeAll } = useEntries();
  const { toggleModal } = useModalStore();

  const handleAddRandomEntry = async () => {
    const newEntry = await getRandomEntry();
    if (confirm(JSON.stringify(newEntry))) {
      addEntry(newEntry);
      toggleModal("add-entry-modal");
    }
  };

  const handleAddRandomEntryDraft = async () => {
    const newEntry = await getRandomEntry();
    const entriesStorage = await chromePersistStorage.getItem("entries-v2");

    if (entriesStorage) {
      entriesStorage?.state?.entries?.set(newEntry.hash, newEntry);
      await chrome.storage.local.set({ ["entries-v2"]: superjson.stringify(entriesStorage) });
    } else {
      const draftParse = superjson.parse(JSON.stringify(draft)) as StorageValue<EntryState>;
      draftParse.state.entries = new Map([[newEntry.hash, newEntry]]);
      await chrome.storage.local.set({ ["entries-v2"]: superjson.stringify(draftParse) });
    }

    toggleModal("add-entry-modal");
  };

  return (
    isDev && (
      <Box
        sx={{
          display: "flex",
          justifyItems: "center",
          justifyContent: "center",
          flexWrap: "nowrap",
          gap: 1,
        }}
      >
        <Button size="small" variant="contained" onClick={handleAddRandomEntryDraft}>
          Random
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => {
            if (confirm("Are you sure you want to remove all entries?")) {
              removeAll();
              toggleModal("add-entry-modal");
            }
          }}
        >
          Remove all
        </Button>
      </Box>
    )
  );
}
