import CardEntryLegacy from "@components/CardEntryLegacy";
import NotEntriesFound from "@components/NotEntriesFound";
import EntriesContext from "@src/contexts/legacy/Entries";
import useRefreshCodes from "@src/hooks/useRefreshCodes";
import { Reorder } from "framer-motion";
import { useContext } from "react";

const RefreshCodes = () => {
  useRefreshCodes();
  return <></>;
};

export default function Entries() {
  const { entries, setEntries, isLoading } = useContext(EntriesContext);
  return isLoading || entries?.length >= 1 ? (
    <>
      <RefreshCodes />
      <Reorder.Group
        axis="y"
        values={entries}
        onReorder={setEntries}
        style={{ paddingTop: 15, display: "flex", flexDirection: "column", gap: 13 }}
      >
        {entries?.map((entry) => (
          <Reorder.Item value={entry} dragListener={false} key={entry.hash} id={entry.hash}>
            <CardEntryLegacy entry={entry} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </>
  ) : (
    <NotEntriesFound />
  );
}