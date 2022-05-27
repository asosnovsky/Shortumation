import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export interface InputAutoTextProps {
  label: string;
  value: string;
  options?: string[];
  error?: string;
  onChange: (v: string) => void;
}
export default function InputAutoText({
  value = "",
  label,
  options = [],
  onChange,
  error,
}: InputAutoTextProps) {

  return <Autocomplete
    freeSolo
    value={value}
    options={options}
    onChange={(_e, v) => onChange(
      v === null ? "" : v
    )}
    renderInput={params => <TextField
      {...params}
      variant="filled"
      label={label}
      error={error !== undefined}
      helperText={error}
      onChange={e => {
        e.preventDefault();
        onChange(
          e.target.value
        )
      }}
    />}
  />
}
