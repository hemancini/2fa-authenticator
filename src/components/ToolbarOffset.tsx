import { styled } from "@mui/material/styles";

const toolbarMinHeight = 32;
const ToolbarOffset = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  "@media (min-width:600px)": { minHeight: toolbarMinHeight },
  minHeight: toolbarMinHeight,
}));

export default ToolbarOffset;
