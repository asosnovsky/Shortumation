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
  return (
    <Autocomplete
      freeSolo
      className={["input-autotext", className ?? ""].join(" ")}
      value={value}
      options={options}
      disableClearable
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
            ...params.InputProps,
            endAdornment: (
              <>
                {endAdornment} {params.InputProps.endAdornment}
              </>
            ),
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
