import Card from "@components/Card";
import Container from "@mui/material/Container";
import { EntryStorage } from "@src/models/storage";

export default function Main() {
  return (
    <Container sx={{ pb: 0.7 }}>
      <Card />
      `${JSON.stringify(EntryStorage.get())}`
    </Container>
  );
}
