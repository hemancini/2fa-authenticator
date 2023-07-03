import CardEntry from "@components/CardEntry";
import Container from "@mui/material/Container";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext, useMemo } from "react";

export default function Entries() {
  const { entries, setEntries } = useContext(EntriesContext);
  return (
    <Container component="main" sx={{ py: 0.7 }}>
      <Reorder.Group axis="y" values={entries} onReorder={setEntries}>
        {useMemo(
          () =>
            entries?.map((entry) => (
              <Reorder.Item value={entry} dragListener={false} key={entry.hash} id={entry.hash}>
                <CardEntry entry={entry} />
              </Reorder.Item>
            )),
          [entries]
        )}
      </Reorder.Group>
    </Container>
  );
}
