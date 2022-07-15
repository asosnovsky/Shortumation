import { SequenceNodeColor } from "./types";
import { useTheme } from "@mui/material/styles";

export const useSequenceNodeColor = (color: SequenceNodeColor): string => {
  const theme = useTheme();

  return color === "blue"
    ? theme.palette.info.main
    : color === "green"
    ? theme.palette.success.light
    : color === "lblue"
    ? theme.palette.info.light
    : color === "red"
    ? theme.palette.warning.dark
    : color === "error"
    ? theme.palette.error.dark
    : "none";
};
