import { Box, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";

import { type IData, type StorageAreas, useStorageAreas } from "../../stores/useStorageAreas";
import DataDialog from "./DataDialog";

export default function DataList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<IData>();
  const [dataContent, setDataContent] = useState<string>();

  const { allData, isEditing, toggleEditing } = useStorageAreas();

  const handleShowData = (data: IData) => {
    const value = typeof data.value === "string" ? data.value : JSON.stringify(data.value, null, 2);
    setDataContent(value);
    setData(data);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setData(undefined);
    setDataContent(undefined);
    if (isEditing) toggleEditing();
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <nav aria-label="main folders">
        <List dense>
          {Object.keys({ ...allData })?.map((area: keyof StorageAreas) => {
            const storage = allData[area];
            return Object.keys(storage)?.map((key) => (
              <ListItem dense key={key} divider disablePadding>
                <ListItemButton
                  dense
                  disableGutters
                  onClick={() => handleShowData({ type: area, title: key, value: storage[key] })}
                >
                  <ListItemText title={key} primary={key} sx={{ pl: 0.5 }} />
                  <ListItemIcon>
                    <Chip
                      label={area}
                      size="small"
                      variant="outlined"
                      sx={{
                        mx: 1,
                        height: 17,
                        "& .MuiChip-label": { fontSize: "0.8rem" },
                      }}
                    />
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ));
          })}
        </List>
      </nav>
      <DataDialog
        {...{
          open,
          data,
          dataContent,
          setDataContent,
          handleCloseModal,
        }}
      />
    </Box>
  );
}
