// import { useState } from "react";
import InputWrapper from "./InputWrapper";
import { useInputNumberStyles } from "./styles";

export interface Props {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}
export default function InputNumber({
  label,
  value = undefined,
  onChange,
}: Props) {
  const { classes } = useInputNumberStyles({});
  return <InputWrapper label={label} labelSize={value !== undefined ? 'small' : 'normal'}>
    <input
      className={classes.input}
      type="number"
      value={value ?? ""}
      onChange={e => {
        e.preventDefault();
        onChange(Number(e.target.value))
      }}
    />
    {value && <button className={classes.deleteIcon} onClick={() => onChange(undefined)}>X</button>}
  </InputWrapper>
}
