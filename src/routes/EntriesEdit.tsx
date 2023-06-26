import CardEntryEdit from "@components/CardEntryEdit";
import Container from "@mui/material/Container";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext } from "react";

export default function EntriesEdit() {
  const { entriesEdit, setEntriesEdit } = useContext(EntriesContext);
  return (
    <Container sx={{ py: 0.5, pt: 0.2 }}>
      <Reorder.Group axis="y" values={entriesEdit} onReorder={setEntriesEdit}>
        {entriesEdit?.map((entry) => (
          <CardEntryEdit key={entry.index} entry={entry} entriesEdit={entriesEdit} setEntriesEdit={setEntriesEdit} />
        ))}
      </Reorder.Group>
    </Container>
  );
}
