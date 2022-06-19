import Close from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Edit from "@mui/icons-material/Edit";
import { ReactNode } from "react";

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
  title?: string;
  helperText?: ReactNode;
  endAdornment?: ReactNode;
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
  endAdornment,
  helperText,
  title,
}: Props) {
  const disabled = value === undefined || value === null;
  let labelElm = <></>;
  let unitElm = <></>;
  if (label) {
    labelElm = <span>{label}</span>;
  }
  if (unit) {
    unitElm = <small>({unit})</small>;
  }

  return (
    <TextField
      variant="filled"
      label={
        <div className="input-number--label">
          {labelElm} {unitElm}
        </div>
      }
      title={title}
      value={value}
      onChange={(e) => onChange(Number(e.target.value ?? 0))}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      required={required}
      fullWidth
      helperText={helperText}
      InputProps={{
        endAdornment: endAdornment ? (
          endAdornment
        ) : (
          <InputAdornment position="end">
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
