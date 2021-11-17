import { useState } from "react";
import InputWrapper from "./InputWrapper";
import { useInputTextStyles } from "./styles";


export interface Props<T extends string> {
    current: T;
    options: readonly T[];
    onChange: (n: string) => void;
    id?: string;
    className?: string;
    label: string;
}
export default function InputList<T extends string>({
    current, options, onChange, label, 
    ...selattr
}: Props<T>) {
    const {classes} = useInputTextStyles({});
    return <InputWrapper label={label} labelSize={'small'}>
        <select 
            className={classes.input}
            {...selattr} value={current} 
            onChange={e => {
                e.preventDefault();
                onChange(e.currentTarget.value);
            }}
        >
            {options.map((t, i) => <option id={String(i)} key={i}>{t}</option>)}
        </select>
    </InputWrapper>
}