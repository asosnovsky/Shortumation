import InputWrapper from "./InputWrapper";
import * as yaml from "js-yaml";
import { useEffect, useRef, useState } from "react";
import InputTextArea from "./InputTextArea";

export interface Props<T extends {}> {
    label: string;
    value: T;
    onChange: (v: T) => void;
    resizable?: boolean;
}
export default function InputYaml<T>({
    label, 
    value={} as any, 
    onChange,
    resizable,
}: Props<T>) {
    const [text, setText] = useState("");
    useEffect(() => {
        setText(yaml.dump(value));
    }, [value]);
    const delayId = useRef<null | number>(null);
    const delayedUpdate = (update: string) => {
        setText(update)
        if (delayId.current) {
            window.clearTimeout(delayId.current);
            delayId.current = null;
        }
        delayId.current = window.setTimeout(() => {
            onChange(yaml.load(update) as any)
        }, 1000);
    }
    return <InputTextArea
        label={label}
        value={text}
        onChange={delayedUpdate}
        resizable={resizable}
    />
}