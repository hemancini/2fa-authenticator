import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";

import { type IData, useStorageAreas } from "../../stores/useStorageAreas";

interface MoreMenuProps {
  data?: IData;
  closeDialog: () => void;
}

export default function MoreMenu({ data, closeDialog }: MoreMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { toggleEditing, removeData } = useStorageAreas();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    toggleEditing();
  };

  const handleDelete = async () => {
    handleClose();

    setTimeout(async () => {
      if (data && confirm(`Delete ${data.title}?`)) {
        removeData(data);
        closeDialog();
      }
    }, 100);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          position: "absolute",
          right: 5,
          top: 6,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleEdit} divider>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
}
