import CardEntryEdit from "@components/CardEntryEdit";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext, useMemo } from "react";

export default function EntriesEdit() {
  const { entriesEdited, setEntriesEdited } = useContext(EntriesContext);
  return (
    <Reorder.Group axis="y" values={entriesEdited} onReorder={setEntriesEdited}>
      {
        // useMemo(  () =>
        entriesEdited?.map((entry) => (
          <CardEntryEdit key={entry.hash} entry={entry} />
        ))
        // ,[entriesEdited] )
      }
    </Reorder.Group>
  );
}
