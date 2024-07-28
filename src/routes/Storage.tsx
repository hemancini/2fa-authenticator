import { Box, Button, Card, Typography } from "@mui/material";
import type { TEntries } from "@src/otp/type";
import { ChromeStorage, Entries } from "@src/storage/chrome-storage";
import { getRandomEntry } from "@src/utils/entry";
import { useEffect, useState } from "react";

export default function StorageRoute() {
  const entries = new Entries();
  const storage = new ChromeStorage<TEntries>("local");

  const [state, setState] = useState<TEntries>();

  useEffect(() => {
    handleGetEntries();
  }, []);

  const handleSetEntries = async () => {
    const entry = await getRandomEntry();
    const newEntries = new Map([[entry.hash, entry]]);
    entries
      .setEntries(newEntries)
      .then((entries) => {
        setState(entries);
      })
      .catch((error) => {
        console.error("Error saving value", error);
      });
  };

  const handleAddEntry = async () => {
    const entry = await getRandomEntry();
    entries
      .addEntry(entry)
      .then((entry) => {
        setState((state) => new Map([[entry.hash, entry], ...Array.from(state ?? [])]));
      })
      .catch((error) => {
        console.error("Error adding value", error);
      });
  };

  const handleGetEntries = async () => {
    await entries
      .getEntries()
      .then((entries) => {
        setState(entries);
      })
      .catch((error) => {
        console.error("Error retrieving value", error);
      });
  };

  const handleRemoveEntry = (hash: string) => {
    entries
      .removeEntry(hash)
      .then(() => {
        setState((state) => {
          const newState = new Map(state);
          newState.delete(hash);
          return newState;
        });
      })
      .catch((error) => {
        console.error("Error removing value", error);
      });
  };

  const handleClearEntries = () => {
    entries
      .clearEntries()
      .then(() => {
        setState(new Map());
      })
      .catch((error) => {
        console.error("Error clearing entries", error);
      });
  };

  const handleClearStorage = () => {
    storage
      .clear()
      .then(() => {
        console.log("Storage cleared");
        setState(new Map());
      })
      .catch((error) => {
        console.error("Error clearing storage", error);
      });
  };

  const handleGetAllValues = () => {
    storage
      .getAll()
      .then((values) => {
        console.log("All values:", values);
      })
      .catch((error) => {
        console.error("Error getting all values", error);
      });
  };

  return (
    <Box sx={{ "&": { display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 1 } }}>
      <Button size="small" onClick={handleAddEntry}>
        Add entry
      </Button>
      <Button size="small" onClick={handleSetEntries}>
        Set entries
      </Button>
      <Button size="small" onClick={handleGetEntries}>
        Get entries
      </Button>
      <Button size="small" onClick={handleClearEntries}>
        Clear entries
      </Button>
      <Box>
        <Button size="small" onClick={handleClearStorage}>
          Clear storage
        </Button>
        <Button size="small" onClick={handleGetAllValues}>
          Get all values
        </Button>
      </Box>
      <Box component={"ul"} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.from(state?.values() ?? []).map((entry) => (
          <li key={entry.hash}>
            <Card sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography>{entry.issuer}</Typography>
                <Typography>{entry.account}</Typography>
              </Box>
              <Box>
                <Button size="small" onClick={() => handleRemoveEntry(entry.hash)}>
                  Remove
                </Button>
              </Box>
            </Card>
          </li>
        ))}
      </Box>
    </Box>
  );
}
