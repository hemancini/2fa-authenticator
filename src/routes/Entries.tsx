import CardEntry from "@components/CardEntry";
import Container from "@mui/material/Container";
import EntriesContext from "@src/contexts/Entries";
import { useContext, useMemo } from "react";

export default function Entries() {
  const { entries, second } = useContext(EntriesContext);

  const count = second % 30;
  const discount = 30 - (second % 30);

  return (
    <Container sx={{ py: 0.5, pt: 0.2 }}>
      <ul>
        {useMemo(
          () =>
            entries?.map((entry) => (
              <li key={entry.index}>
                <CardEntry entry={entry} count={count} discount={discount} />
              </li>
            )),
          [entries, count, discount]
        )}
      </ul>
    </Container>
  );
}
