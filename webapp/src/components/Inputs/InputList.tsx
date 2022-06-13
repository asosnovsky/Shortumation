import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { prettyName } from "utils/formatting";

export interface Props<T extends string> {
  current: T;
  options: readonly T[];
  onChange: (n: T) => void;
  label: string;
  id?: string;
  className?: string;
  prettyOptionLabels?: boolean;
}
export function InputList<T extends string>({
  current,
  options,
  onChange,
  label,
  id,
  className,
  prettyOptionLabels,
}: Props<T>) {
  const invalidCurrent = current && !options.includes(current);
  return <FormControl className={className} variant="filled" sx={{ marginRight: "0.25em", minWidth: `${label.length * 0.75}em` }}>
    <InputLabel>{label}</InputLabel>
    <Select
      autoWidth
      id={id}
      value={current}
      onChange={(e) => {
        onChange(e.target.value as T)
      }}
      label={label}
      variant="filled"
      placeholder={label}
      error={invalidCurrent}

    >
      {options.map((t, i) => (
        <MenuItem
          key={i}
          value={t}
        >
          {prettyOptionLabels ? prettyName(t) : t}
        </MenuItem>
      ))}
    </Select>
    <FormHelperText>{invalidCurrent ? `'${current}' is not a valid selection` : ''}</FormHelperText>
  </FormControl>
}
