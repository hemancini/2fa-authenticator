import CardEntryEdit from "@components/CardEntryEdit";
import Container from "@mui/material/Container";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext, useMemo } from "react";

export default function EntriesEdit() {
  const { entriesEdited, setEntriesEdited } = useContext(EntriesContext);
  return (
    <Container sx={{ py: 0.5, pt: 0.2 }}>
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
