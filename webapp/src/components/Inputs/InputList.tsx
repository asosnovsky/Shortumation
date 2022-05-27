import { FC } from "react";
import FilledInput from '@mui/material/FilledInput';
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
  const invalidCurrent = !options.includes(current);
  return <FormControl variant="filled" sx={{ marginRight: "0.25em" }}>
    <InputLabel id="demo-simple-select-filled-label">{label}</InputLabel>
    <Select
      className={className}
      fullWidth
      id={id}
      value={current}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      label={label}
      variant="filled"
      placeholder={label}
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
  </FormControl>
  // return <InputWrapper label={label} labelSize={'small'} noMargin error={invalidCurrent ? "Invalid Selection" : undefined}>
  //   <select
  //     title={invalidCurrent ? "Invalid Selection" : ""}
  //     className={classes.input}
  //     {...selattr} value={current}
  //     onChange={e => {
  //       e.preventDefault();
  //       if (e.currentTarget.id === 'invalid') {
  //         onChange(options[0])
  //       } else {
  //         onChange(e.currentTarget.value as any);
  //       }
  //     }}
  //   >
  //     {options.map((t, i) => <option id={String(i)} key={i} value={t}>{t}</option>)}
  //     {invalidCurrent ? <option
  //       id={'invalid'}
  //       value={current}
  //       style={{ display: 'none' }}
  //     >!{current}!</option> : <></>}
  //   </select>
  // </InputWrapper>
}
