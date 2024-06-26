import CardEntry from "@components/CardEntry";
import NotEntriesFound from "@components/NotEntriesFound";
import EntriesContext from "@src/contexts/Entries";
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
      <Reorder.Group axis="y" values={entries} onReorder={setEntries}>
        {entries?.map((entry) => (
          <Reorder.Item value={entry} dragListener={false} key={entry.hash} id={entry.hash}>
            <CardEntry entry={entry} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </>
  ) : (
    <NotEntriesFound />
  );
}
