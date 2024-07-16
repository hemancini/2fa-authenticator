import CardEntryEdit from "@components/CardEntryLegacy/CardEntryEdit";
import EntriesContext from "@src/legacy/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext, useState } from "react";

const useEntriesEdit = () => {
  const [_render, handleRender] = useState(false);
  return { handleRender };
};

export default function EntriesEdit() {
  const { entriesEdited, setEntriesEdited } = useContext(EntriesContext);
  const { handleRender } = useEntriesEdit();

  return (
    <Reorder.Group axis="y" values={entriesEdited} onReorder={setEntriesEdited}>
      {entriesEdited?.map((entry) => (
        <CardEntryEdit key={entry.hash} entry={entry} handleRender={handleRender} />
      ))}
    </Reorder.Group>
  );
}
