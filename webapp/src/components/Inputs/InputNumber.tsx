import Close from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Edit from "@mui/icons-material/Edit";

export interface Props {
  label: string | JSX.Element;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: any;
  required?: boolean;
}
export default function InputNumber({
  label,
  value = undefined,
  onChange,
  className = "",
  min,
  max,
  step,
  unit,
  placeholder,
  required,
}: Props) {
  const disabled = value === undefined || value === null;
  return (
    <TextField
      variant="filled"
      label={label}
      value={value}
      defaultValue={value}
      onChange={(e) => onChange(Number(e.target.value ?? 0))}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      required={required}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {unit}
            <IconButton onClick={() => onChange(disabled ? 0 : undefined)}>
              {disabled ? <Edit /> : <Close />}
            </IconButton>
          </InputAdornment>
        ),
        inputProps: {
          min,
          max,
          type: "number",
          step,
        },
      }}
    />
  );
}
