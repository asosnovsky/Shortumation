import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FC } from "react";

export interface Props {
  label: string;
  value: string | string[];
  options?: string[];
  onChange: (v: string[]) => void;
}
export default function InputTextBubble({
  value = "",
  label,
  options = [],
  onChange,
}: Props) {

  const selected = Array.isArray(value) ? value : [value];

  return <Autocomplete
    multiple
    freeSolo
    value={selected}
    options={options}
    onChange={(_e, v) => onChange(
      v === null ? [] :
        Array.isArray(v) ? v : [v]
    )}
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

export const InputEntity: FC<{
  value: string | string[];
  onChange: (v: string[]) => void;
}> = ({
  value,
  onChange,
}) => <InputTextBubble
      value={value}
      onChange={onChange}
      label="Entity ID"
    />
