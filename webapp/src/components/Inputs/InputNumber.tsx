import InputWrapper from "./InputWrapper";
import { useInputNumberStyles } from "./styles";

export interface Props {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  className?: string;
  min?: number,
  max?: number,
  step?: number,
}
export default function InputNumber({
  label,
  value = undefined,
  onChange,
  className = "",
  min, max, step,
}: Props) {
  const { classes } = useInputNumberStyles({});
  return <InputWrapper className={className} label={label} labelSize={value !== undefined ? 'small' : 'normal'}>
    <input
      className={classes.input}
      type="number"
      value={value ?? ""}
      onChange={e => {
        e.preventDefault();
        let v = Number(e.target.value);
        if (max) {
          v = Math.min(v, max)
        }
        if (min) {
          v = Math.max(v, min)
        }
        onChange(v)
      }}
      step={step}
      min={min}
      max={max}
    />
    {value && <button className={classes.deleteIcon} onClick={() => onChange(undefined)}>X</button>}
  </InputWrapper>
}
