import { Divider } from "@mui/material";
import { decrypt } from "@src/utils/crypto";
import { useEffect, useState } from "react";
import superjson from "superjson";

const isEncrypted = !(import.meta.env.VITE_DATA_ENCRYPTED === "false");

export default function StringifyEntries({ data }: { data?: string }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    try {
      const dataStringify = JSON.stringify(
        JSON.parse(superjson.stringify(superjson.parse(isEncrypted ? decrypt(data) : data))),
        null,
        2
      );
      setValue(dataStringify);
    } catch (error) {
      console.error(error?.message);
    }
  }, []);

  return (
    <>
      <Divider />
      <pre>{value}</pre>
    </>
  );
}
