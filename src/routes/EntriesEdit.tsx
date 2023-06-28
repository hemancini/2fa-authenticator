import CardEntryEdit from "@components/CardEntryEdit";
import Container from "@mui/material/Container";
import EntriesContext from "@src/contexts/Entries";
import { Reorder } from "framer-motion";
import { useContext } from "react";

export default function EntriesEdit() {
  const { entriesEdited, setEntriesEdited } = useContext(EntriesContext);
  return (
    <Container sx={{ py: 0.5, pt: 0.2 }}>
      <Reorder.Group axis="y" values={entriesEdited} onReorder={setEntriesEdited}>
        {entriesEdited?.map((entry) => (
          <CardEntryEdit
            key={entry.index}
            entry={entry}
            entriesEdited={entriesEdited}
            setEntriesEdited={setEntriesEdited}
          />
        ))}
      </Reorder.Group>
    </Container>
  );
}
