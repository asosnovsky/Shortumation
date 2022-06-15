import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ReactNode } from "react";

export interface InputAutoTextProps {
  label: string;
  value: string;
  className?: string;
  options?: string[];
  error?: string;
  required?: boolean;
  endAdornment?: ReactNode;
  onChange: (v: string) => void;
}
export default function InputAutoText({
  value = "",
  label,
  options = [],
  onChange,
  className,
  required,
  endAdornment,
  error,
}: InputAutoTextProps) {
  console.log(options);
  return (
    <Autocomplete
      freeSolo
      className={className}
      value={value}
      options={options}
      onChange={(_e, v) => onChange(v === null ? "" : v)}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          variant="filled"
          label={label}
          error={error !== undefined}
          helperText={error}
          fullWidth
          InputProps={{
            endAdornment,
          }}
          onChange={(e) => {
            e.preventDefault();
            onChange(e.target.value);
          }}
        />
      )}
    />
  );
}
