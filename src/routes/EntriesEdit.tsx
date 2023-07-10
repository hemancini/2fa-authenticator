import CardEntryEdit from "@components/CardEntryEdit";
import NotEntriesFound from "@components/NotEntriesFound";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext, useEffect, useMemo, useState } from "react";

const useEntriesEdit = () => {
  const [_render, handleRender] = useState(false);
  return { handleRender };
};

export default function EntriesEdit() {
  const { entriesEdited, setEntriesEdited, isLoading } = useContext(EntriesContext);
  const { handleRender } = useEntriesEdit();

  return isLoading || entriesEdited?.length >= 1 ? (
    <Reorder.Group axis="y" values={entriesEdited} onReorder={setEntriesEdited}>
      {
        // useMemo(  () =>
        entriesEdited?.map((entry) => (
          <CardEntryEdit key={entry.hash} entry={entry} handleRender={handleRender} />
        ))
        // ,[entriesEdited] )
      }
    </Reorder.Group>
  ) : (
    <NotEntriesFound />
  );
}
