import useMediaQuery from "@mui/material/useMediaQuery";
import { useOptionsStore } from "@src/stores/useOptions";
import { useRef } from "react";

import { useStorageAreas } from "../../stores/useStorageAreas";

interface EditablePreProps {
  dataContent: string;
  setDataContent: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditablePre({ dataContent, setDataContent }: EditablePreProps) {
  const { themeMode } = useOptionsStore();
  const preRef = useRef<HTMLPreElement>(null);

  const { isEditing } = useStorageAreas();

  const handleInput = () => {
    if (preRef.current) {
      setDataContent(preRef.current.innerText);
    }
  };

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = themeMode === "system" ? (prefersDarkMode ? "dark" : "light") : themeMode ?? "dark";

  return (
    <div>
      <pre
        ref={preRef}
        contentEditable={isEditing}
        onBlur={handleInput}
        style={{
          ...(isEditing && {
            // padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: mode === "dark" ? "#333" : "#f7f7f7",
          }),
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: dataContent }}
      />
    </div>
  );
}
