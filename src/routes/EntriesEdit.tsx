import CardEntryEdit from "@components/CardEntryEdit";
import NotEntriesFound from "@components/NotEntriesFound";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext, useMemo } from "react";

export default function EntriesEdit() {
  const { entriesEdited, setEntriesEdited } = useContext(EntriesContext);
  return entriesEdited?.length >= 1 ? (
    <Reorder.Group axis="y" values={entriesEdited} onReorder={setEntriesEdited}>
      {
        // useMemo(  () =>
        entriesEdited?.map((entry) => (
          <CardEntryEdit key={entry.hash} entry={entry} />
        ))
        // ,[entriesEdited] )
      }
    </Reorder.Group>
  ) : (
    <NotEntriesFound />
  );
}
