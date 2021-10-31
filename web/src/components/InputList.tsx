import { SelectHTMLAttributes } from "react";
import InputWrapper from "./InputWrapper";


export interface Props {
    current: string;
    options: readonly string[];
    onChange: (n: string) => void;
    id?: string;
    className?: string;
    label: string;
}
export default function InputList({current, options, onChange, label, ...selattr}: Props) {
    return <InputWrapper label={label}>
        <select {...selattr} value={current} onChange={e => {
            e.preventDefault();
            onChange(e.currentTarget.value);
        }}>
            {options.map((t, i) => <option id={String(i)} key={i}>{t}</option>)}
        </select>
    </InputWrapper>
}