import ListItemIconMui, { ListItemIconProps } from "@mui/material/ListItemIcon";

export default function CustomItemIcon(props: ListItemIconProps) {
  return <ListItemIconMui sx={{ minWidth: "auto", ml: 0.2, mr: 2 }} {...props} />;
}
