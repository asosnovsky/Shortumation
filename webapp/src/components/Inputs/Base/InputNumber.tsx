import "./InputNumber.css";
import Close from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Edit from "@mui/icons-material/Edit";
import { ReactNode } from "react";
import { ButtonIcon } from "components/Icons/ButtonIcons";

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
      className={["input-number", className ?? ""].join(" ")}
      placeholder={placeholder}
      required={required}
      fullWidth
      helperText={helperText}
      InputProps={{
        endAdornment: endAdornment ? (
          endAdornment
        ) : (
          <InputAdornment position="end">
            <ButtonIcon
              onClick={() => onChange(disabled ? 0 : undefined)}
              icon={disabled ? <Edit /> : <Close />}
            />
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
