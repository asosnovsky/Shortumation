import React, { PropsWithChildren, ReactNode, useState } from "react";
import { useToolTip } from "tooltip/context";
import TextField from "@mui/material/TextField";
import InputWrapper from "./InputWrapper";

export interface Props {
  textBoxFor?: string;
  label: string | JSX.Element;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  additionalTooltipFilters?: Record<string, string>;
  multiline?: boolean;
  maxRows?: number;
  className?: string;
  placeholder?: any;
  title?: string;
  helperText?: string;
  endAdornment?: ReactNode;
  required?: boolean;
}
export default function InputText({
  label,
  title,
  helperText,
  textBoxFor,
  value = "",
  onChange,
  endAdornment,
  onEnter = () => {},
  additionalTooltipFilters = {},
  multiline = false,
  maxRows = 4,
  children,
  className,
  placeholder,
  required,
}: PropsWithChildren<Props>) {
  const tooltip = useToolTip();
  const [isFocused, setIsFocused] = useState(false);
  return (
    <InputWrapper className={className} label="">
      <TextField
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
          if (textBoxFor) {
            tooltip.setFocus(
              e.target.getBoundingClientRect(),
              {
                searchObject: textBoxFor,
                searchText: value,
                filterObjects: additionalTooltipFilters,
              },
              onChange
            );
          }
        }}
      />
      {children}
    </InputWrapper>
  );
}
