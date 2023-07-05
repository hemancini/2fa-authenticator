import CardEntryEdit from "@components/CardEntryEdit";
import Container from "@mui/material/Container";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext, useMemo } from "react";

export default function EntriesEdit() {
  const { entriesEdited, setEntriesEdited } = useContext(EntriesContext);
  return (
    <Container component="main" sx={{ py: 0.7 }}>
      <Reorder.Group axis="y" values={entriesEdited} onReorder={setEntriesEdited}>
        {
          // useMemo(  () =>
          entriesEdited?.map((entry) => (
            <CardEntryEdit key={entry.hash} entry={entry} />
          ))
          // ,[entriesEdited] )
        }
      </Reorder.Group>
    </Container>
  );
}
