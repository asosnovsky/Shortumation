import { FC } from "react";
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export interface Props<T extends string> {
  current: T;
  options: readonly T[];
  onChange: (n: T) => void;
  label: string;
  id?: string;
  className?: string;
}
export const InputList: FC<Props<any>> = ({
  current,
  options,
  onChange,
  label,
  id,
  className,
}) => {
  const invalidCurrent = current && !options.includes(current);
  return <FormControl variant="filled" sx={{ marginRight: "0.25em", minWidth: `${label.length * 0.75}em` }}>
    <InputLabel id="demo-simple-select-filled-label">{label}</InputLabel>
    <Select
      className={className}
      autoWidth
      id={id}
      value={current}
      onChange={(e) => {
        onChange(e.target.value)
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
          {t}
        </MenuItem>
      ))}
    </Select>
    <FormHelperText>{invalidCurrent ? `'${current}' is not a valid selection` : ''}</FormHelperText>
  </FormControl>
}
