import "./InputList.css";

import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { prettyName } from "utils/formatting";
import { ReactNode } from "react";

export type Props<T extends string | Object> = {
  current?: T;
  options: readonly T[];
  onChange: (n: T) => void;
  label: string;
  id?: string;
  className?: string;
  prettyOptionLabels?: boolean;
  getKey?: (n: T) => string;
  getDescription?: (n: T) => string;
  placeholder?: any;
  title?: string;
  helperText?: string;
  endAdornment?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
};
export function InputList<T extends string | Object>({
  current,
  options,
  onChange,
  label,
  id,
  className,
  prettyOptionLabels = true,
  getKey = String,
  getDescription,
  placeholder,
  title,
  helperText,
  endAdornment,
  disabled,
  fullWidth = true,
}: Props<T>) {
  const invalidCurrent =
    current && !options.map(getKey).includes(getKey(current));
  return (
    <FormControl
      className={className}
      variant="filled"
      sx={{ marginRight: "0.25em", minWidth: `${label.length * 0.75}em` }}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        title={title}
        placeholder={placeholder ?? label}
        endAdornment={endAdornment}
        autoWidth
        id={id}
        value={current ? getKey(current) : ""}
        onChange={(e) => {
          const key = e.target.value;
          const option = options.filter((opt) => getKey(opt) === key)[0];
          onChange(option);
        }}
        label={label}
        variant="filled"
        error={invalidCurrent}
        fullWidth={fullWidth}
        disabled={disabled}
      >
        {options.map((t, i) => (
          <MenuItem key={i} value={getKey(t)} className="input-list--menu-item">
            {prettyOptionLabels ? prettyName(getKey(t)) : getKey(t)}
            {!!getDescription && (
              <>
                <br />
                <div className="input-list--menu-item--description">
                  {getDescription(t)}
                </div>
              </>
            )}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText variant="filled" error={invalidCurrent}>
        {invalidCurrent ? `'${current}' is not a valid selection` : helperText}
      </FormHelperText>
    </FormControl>
  );
}
