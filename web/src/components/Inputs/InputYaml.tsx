import InputWrapper from "./InputWrapper";
import * as yaml from "js-yaml";
import { useEffect, useRef, useState } from "react";

export interface Props<T> {
    label: string;
    value: T;
    onChange: (v: T) => void;
}
export default function InputYaml<T>({
    label, 
    value={} as any, 
    onChange,
}: Props<T>) {
    const [text, setText] = useState("");
    useEffect(() => {
        setText(yaml.dump(value));
    }, [value]);
    const delayId = useRef<null | number>(null);
    const delayedUpdate = (update: string) => {
        if (delayId.current) {
            window.clearTimeout(delayId.current);
            delayId.current = null;
        }
        delayId.current = window.setTimeout(() => {
            onChange(yaml.load(update) as any)
        }, 1000);
    }
    return <InputWrapper label={label}>
        <textarea 
            value={text} 
            onChange={e => {
                e.preventDefault();
                setText(e.target.value);
                delayedUpdate(e.target.value);
            }} 
        />
    </InputWrapper>
}