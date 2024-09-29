import CustomItemButton from "@components/Options/CustomItemButton";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import Divider from "@mui/material/Divider";
import { useEntries } from "@src/stores/useEntries";
import { useModalStore } from "@src/stores/useModal";
import { getRandomEntry } from "@src/utils/entry";

export function RandomButton() {
  const { addEntry } = useEntries();
  const { toggleModal } = useModalStore();
  const handleRandom = async () => {
    const newEntry = await getRandomEntry();
    if (confirm(JSON.stringify(newEntry))) {
      addEntry(newEntry);
      toggleModal("add-entry-modal");
    }
  };
  return (
    <>
      <Divider />
      <CustomItemButton
        primary={"Random"}
        toolltip={"Random"}
        handleButton={handleRandom}
        icon={<ShuffleIcon />}
        disableLeftPadding
      />
    </>
  );
}
