import EntryCard from "@components/EntryCard";
import NotEntriesFound from "@components/NotEntriesFound";
import useUrlHashState from "@src/hooks/useUrlHashState";
import { useEntries } from "@src/stores/useEntries";
import { useEntriesUtils } from "@src/stores/useEntriesUtils";
import { getIsMigrated, migrateLegacy, setMigrated } from "@src/utils/entry";
import { Reorder } from "framer-motion";
import { useEffect } from "react";

export default function Entries() {
  const { entries, framerReorder, setEntries } = useEntries();
  const hasEntries = entries.size > 0;
  const entriesList = hasEntries ? Array.from(entries.values()) : [];
  const [isEditing] = useUrlHashState("#/edit");
  const { removes } = useEntriesUtils();

  useEffect(() => {
    (async () => {
      const isMigrated = await getIsMigrated();
      if (isMigrated) return;

      const entriesMigrated = await migrateLegacy();
      setEntries(entriesMigrated);
      await setMigrated(true);
    })();
  }, []);

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
