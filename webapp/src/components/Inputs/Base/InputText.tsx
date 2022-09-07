import { ReactNode, useState } from "react";
import TextField from "@mui/material/TextField";

export interface Props {
  textBoxFor?: string;
  label?: string | JSX.Element;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  additionalTooltipFilters?: Record<string, string>;
  multiline?: boolean;
  maxRows?: number;
  className?: string;
  placeholder?: any;
  title?: string;
  helperText?: ReactNode;
  endAdornment?: ReactNode;
  required?: boolean;
}
export default function InputText({
  label,
  title,
  helperText,
  value = "",
  onChange,
  endAdornment,
  onEnter = () => {},
  multiline = false,
  maxRows = 4,
  className,
  placeholder,
  required,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <TextField
      className={className}
      multiline={multiline}
      maxRows={maxRows}
      fullWidth
      inputMode="text"
      variant="filled"
      focused={isFocused}
      label={label}
      value={value}
      title={title}
      helperText={helperText}
      placeholder={placeholder}
      InputProps={{
        endAdornment,
      }}
      required={required}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter();
        }
      }}
      onChange={(e) => {
        e.preventDefault();
        onChange(e.target.value);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
      onFocus={(e) => {
        setIsFocused(true);
      }}
    />
  );
}
