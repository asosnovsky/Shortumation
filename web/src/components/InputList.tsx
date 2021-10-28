import { SelectHTMLAttributes } from "react";


export interface Props {
    current: string;
    options: readonly string[];
    onChange: (n: string) => void;
    id?: string;
    className?: string;
}
export default function InputList({current, options, onChange, ...selattr}: Props) {
    return <select {...selattr} value={current} onChange={e => {
        e.preventDefault();
        onChange(e.currentTarget.value);
    }}>
        {options.map((t, i) => <option id={String(i)} key={i}>{t}</option>)}
    </select>
}