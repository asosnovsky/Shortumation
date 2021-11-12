import { CSSProperties, PropsWithChildren } from "react";


export interface Props {
    label: string;
    style?: CSSProperties;
}
export default function InputWrapper({label, children, style={}}: PropsWithChildren<Props>) {
    return <div className="input-wrapper" style={style}>
        <label>{label}</label>
        {children}
    </div>
}