import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FC } from "react";

export interface Props {
  label: string;
  value?: string | string[];
  options?: string[];
  onChange: (v: string[]) => void;
  maxAllowed?: number;
}
export default function InputTextBubble({
  value = "",
  label,
  options = [],
  onChange,
  maxAllowed,
}: Props) {

  const selected = Array.isArray(value) ? value : value ? [value] : [];

  return <Autocomplete
    multiple
    freeSolo
    value={selected}
    options={options}
    onChange={(_e, v) => {
      let cleanValue = v === null ? [] :
        Array.isArray(v) ? v : [v]

      if (maxAllowed) {
        cleanValue = cleanValue.slice(0, maxAllowed);
      }

      onChange(cleanValue)
    }}
    renderInput={params => <TextField
      {...params}
      variant="filled"
      label={label}
    />}
    renderTags={(tagValue, getTagProps) =>
      tagValue.map((option, index) => (
        <Chip
          label={option}
          {...getTagProps({ index })}
        />
      ))
    }
  />
}
