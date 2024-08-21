import Tooltip from "@components/CustomTooltip";
import AddIcon from "@mui/icons-material/Add";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { t } from "@src/chrome/i18n";
import { IS_DEV } from "@src/config";
import useUrlHashState from "@src/hooks/useUrlHashState";
import { useEntries } from "@src/stores/useEntries";
import { useModalStore } from "@src/stores/useModal";
import { useOptionsStore } from "@src/stores/useOptions";
import React, { useState } from "react";

export default function MoreOptions() {
  const [, toggleEditing] = useUrlHashState("#/edit");
  const { toggleModal } = useModalStore();
  const { isVisibleTokens, toggleVisibleTokens, useLegacyAddEntryMenu } = useOptionsStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { entries, removeAll } = useEntries();
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
      <IconButton
        size="small"
        color="inherit"
        //  disabled={location !== "/"}
        onClick={handleClick}
      >
        <Tooltip title={t("moreOptions")} placement="bottom">
          <MoreVertIcon />
        </Tooltip>
      </IconButton>

      {anchorEl && (
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          sx={{
            "& .MuiListItemIcon-root": { minWidth: 31 },
            "& .MuiDivider-root.MuiDivider-fullWidth": { my: 0.5 },
          }}
        >
          <MenuItem
            divider
            onClick={() => {
              toggleModal(useLegacyAddEntryMenu ? "add-entry-modal-legacy" : "add-entry-modal");
              handleClose();
            }}
          >
            <ListItemIcon>{useLegacyAddEntryMenu ? <AddIcon /> : <DataSaverOnIcon />}</ListItemIcon>
            {t("addEntry")}
          </MenuItem>
          <MenuItem
            divider
            disabled={emptyEntries}
            onClick={() => {
              toggleEditing();
              handleClose();
            }}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            {t("editEntries")}
          </MenuItem>
          <MenuItem
            divider={IS_DEV}
            disabled={emptyEntries}
            onClick={() => {
              toggleVisibleTokens();
              handleClose();
            }}
          >
            <ListItemIcon>{isVisibleTokens ? <VisibilityIcon /> : <VisibilityOffIcon />}</ListItemIcon>
            {t("visibleTokens")}
          </MenuItem>
          {IS_DEV && (
            <MenuItem
              disabled={entries.size === 0}
              onClick={() => {
                if (confirm("Are you sure you want to remove all entries?")) {
                  removeAll();
                  handleClose();
                }
              }}
            >
              <ListItemIcon>
                <DeleteSweepIcon />
              </ListItemIcon>
              Delete all
            </MenuItem>
          )}
        </Menu>
      )}
    </>
  );
}
