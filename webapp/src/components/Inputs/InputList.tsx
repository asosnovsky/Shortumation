import { FC } from "react";
import InputWrapper from "./InputWrapper";
import { useInputListStyles } from "./styles";


export interface Props<T extends string> {
  current: T;
  options: readonly T[];
  onChange: (n: T) => void;
  id?: string;
  className?: string;
  label: string;
}
export const InputList: FC<Props<any>> = ({
  current, options, onChange, label,
  ...selattr
}) => {
  const invalidCurrent = !options.includes(current);
  const { classes } = useInputListStyles({
    invalidCurrent
  });
  return <InputWrapper label={label} labelSize={'small'} noMargin error={invalidCurrent ? "Invalid Selection" : undefined}>
    <select
      title={invalidCurrent ? "Invalid Selection" : ""}
      className={classes.input}
      {...selattr} value={current}
      onChange={e => {
        e.preventDefault();
        if (e.currentTarget.id === 'invalid') {
          onChange(options[0])
        } else {
          onChange(e.currentTarget.value as any);
        }
      }}
    >
      {options.map((t, i) => <option id={String(i)} key={i} value={t}>{t}</option>)}
      {invalidCurrent ? <option
        id={'invalid'}
        value={current}
        style={{ display: 'none' }}
      >!{current}!</option> : <></>}
    </select>
  </InputWrapper>
}
