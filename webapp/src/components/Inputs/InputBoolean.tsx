import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ReactNode } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";

export interface Props {
  label: string;
  value: boolean;
  title?: string;
  helperText?: ReactNode;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  placeholder?: string;
  endAdornment?: ReactNode;
}
export default function InputBoolean({
  label,
  value = false,
  title,
  helperText,
  onChange,
  disabled = false,
  className,
  required,
  placeholder,
  endAdornment,
}: Props) {
  return (
    <FormGroup
      className={className}
      title={title}
      style={{
        alignItems: "flex-start",
      }}
    >
      <FormControlLabel
        disabled={disabled}
        control={
          <Checkbox
            checked={value}
            onChange={() => onChange(!value)}
            required={required}
            placeholder={placeholder}
          />
        }
        label={
          endAdornment ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  flex: 1,
                }}
              >
                {label}
              </span>
              <InputAdornment position="end">{endAdornment}</InputAdornment>
            </div>
          ) : (
            label
          )
        }
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormGroup>
  );
}
