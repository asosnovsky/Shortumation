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
  placeholder?: any;
  title?: string;
  helperText?: string;
  endAdornment?: ReactNode;
};
export function InputList<T extends string | Object>({
  current,
  options,
  onChange,
  label,
  id,
  className,
  prettyOptionLabels,
  getKey = String,
  placeholder,
  title,
  helperText,
  endAdornment,
}: Props<T>) {
  const invalidCurrent =
    current && !options.map(getKey).includes(getKey(current));
  return (
    <FormControl
      className={className}
      variant="filled"
      sx={{ marginRight: "0.25em", minWidth: `${label.length * 0.75}em` }}
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
        fullWidth
      >
        {options.map((t, i) => (
          <MenuItem key={i} value={getKey(t)}>
            {prettyOptionLabels ? prettyName(getKey(t)) : getKey(t)}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText variant="filled" error={invalidCurrent}>
        {invalidCurrent ? `'${current}' is not a valid selection` : helperText}
      </FormHelperText>
    </FormControl>
  );
}
