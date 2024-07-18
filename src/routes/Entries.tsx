import EntryCard from "@components/CardEntry";
import NotEntriesFound from "@components/NotEntriesFound";
import EntriesContext from "@src/contexts/legacy/Entries";
import useUrlHashState from "@src/hooks/useUrlHashState";
import { useEntries } from "@src/stores/useEntries";
import { useEntriesUtils } from "@src/stores/useEntriesUtils";
import { migrateV1ToV2 } from "@src/utils/entry";
import { Reorder } from "framer-motion";
import { useContext, useEffect } from "react";

export default function Entries() {
  const { entries: entriesLegacy } = useContext(EntriesContext);
  const { entries, framerReorder, setEntries } = useEntries();
  const entriesList = Array.from(entries.values());
  const hasEntries = entries.size > 0;
  const [isEditing] = useUrlHashState("#/edit");
  const { removes } = useEntriesUtils();

  useEffect(() => {
    if (entries.size === 0) {
      const entriesMigrated = migrateV1ToV2(entriesLegacy);
      setEntries(entriesMigrated);
    } else {
      console.log("Entries already migrated");
    }
  }, [entriesLegacy]);

  return hasEntries ? (
    <Reorder.Group
      axis="y"
      values={entriesList}
      onReorder={framerReorder}
      style={{ paddingTop: 15, display: "flex", flexDirection: "column", gap: 12 }}
    >
      {entriesList?.map(
        (entry) =>
          !removes.includes(entry.hash) && (
            <Reorder.Item key={entry.hash} id={entry.hash} value={entry} dragListener={isEditing}>
              <EntryCard entry={entry} />
            </Reorder.Item>
          )
      )}
    </Reorder.Group>
  ) : (
    <NotEntriesFound />
  );
}
