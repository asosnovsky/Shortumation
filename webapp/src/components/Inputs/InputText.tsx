import { PropsWithChildren, useState } from "react";
import { useToolTip } from "tooltip/context";
import TextField from '@mui/material/TextField';
import InputWrapper from "./InputWrapper";

export interface Props {
  textBoxFor?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  additionalTooltipFilters?: Record<string, string>;
  multiline?: boolean;
  maxRows?: number;
}
export default function InputText({
  label,
  textBoxFor,
  value = "",
  onChange,
  onEnter = () => { },
  additionalTooltipFilters = {},
  multiline = false,
  maxRows = 4,
  children,
}: PropsWithChildren<Props>) {
  const tooltip = useToolTip();
  const [isFocused, setIsFocused] = useState(false)
  return <InputWrapper label="">
    <TextField multiline={multiline} maxRows={maxRows} fullWidth inputMode="text" variant="filled" focused={isFocused} label={label} value={value}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onEnter();
        }
      }}
      onChange={e => {
        e.preventDefault();
        onChange(e.target.value)
      }}
      onBlur={() => {
        setIsFocused(false)
      }}
      onFocus={e => {
        setIsFocused(true)
        if (textBoxFor) {
          tooltip.setFocus(
            e.target.getBoundingClientRect(),
            {
              searchObject: textBoxFor,
              searchText: value,
              filterObjects: additionalTooltipFilters,
            },
            onChange
          )
        }
      }}
    />
    {children}
  </InputWrapper>
}
