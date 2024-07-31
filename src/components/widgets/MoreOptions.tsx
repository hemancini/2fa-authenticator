import Tooltip from "@components/CustomTooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { t } from "@src/chrome/i18n";
import useUrlHashState from "@src/hooks/useUrlHashState";
import { useModalStore } from "@src/stores/useDynamic";
import { useEntries } from "@src/stores/useEntries";
import { useOptionsStore } from "@src/stores/useOptions";
import React, { useState } from "react";
import { useLocation } from "wouter";

export default function MoreOptions() {
  const [location] = useLocation();
  const [, toggleEditing] = useUrlHashState("#/edit");
  const { toggleModal } = useModalStore();
  const { isVisibleCodes, setVisibleCodes } = useOptionsStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { entries } = useEntries();
  const emptyEntries = entries.size === 0;
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" color="inherit" onClick={handleClick} disabled={location !== "/"}>
        <Tooltip title={t("moreOptions")} placement="bottom">
          <MoreVertIcon />
        </Tooltip>
      </IconButton>

      {anchorEl && (
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuList dense={true} sx={{ py: 0 }}>
            <MenuItem
              dense={true}
              onClick={() => {
                toggleModal("add-entry-modal");
                handleClose();
              }}
              sx={{ "& .MuiListItemIcon-root": { minWidth: 31 } }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              {t("addEntry")}
            </MenuItem>
            <Divider sx={{ "&.MuiDivider-root.MuiDivider-fullWidth": { my: 0.5 } }} />
            <MenuItem
              dense={true}
              disabled={emptyEntries}
              onClick={() => {
                toggleEditing();
                handleClose();
              }}
              sx={{ "& .MuiListItemIcon-root": { minWidth: 31 } }}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              {t("editEntries")}
            </MenuItem>
            <Divider sx={{ "&.MuiDivider-root.MuiDivider-fullWidth": { my: 0.5 } }} />
            <MenuItem
              dense={true}
              disabled={emptyEntries}
              onClick={() => {
                setVisibleCodes(!isVisibleCodes);
                handleClose();
              }}
              sx={{ "& .MuiListItemIcon-root": { minWidth: 31 } }}
            >
              <ListItemIcon>{isVisibleCodes ? <VisibilityIcon /> : <VisibilityOffIcon />}</ListItemIcon>
              {t("visibleToken")}
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
