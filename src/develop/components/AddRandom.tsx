import { Box, Button } from "@mui/material";
import { useEntries } from "@src/stores/useEntries";
import { useModalStore } from "@src/stores/useModal";
import { getRandomEntry } from "@src/utils/entry";

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
        <Button size="small" variant="contained" onClick={handleAddRandomEntry}>
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
