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
export default function InputList<T extends string>({
  current, options, onChange, label,
  ...selattr
}: Props<T>) {
  const { classes } = useInputListStyles({});
  return <InputWrapper label={label} labelSize={'small'} noMargin>
    <select
      className={classes.input}
      {...selattr} value={current}
      onChange={e => {
        e.preventDefault();
        onChange(e.currentTarget.value as any);
      }}
    >
      {options.map((t, i) => <option id={String(i)} key={i}>{t}</option>)}
    </select>
  </InputWrapper>
}
