import { PropsWithChildren } from "react";


export interface Props {
    label: string;
}
export default function InputWrapper({label, children}: PropsWithChildren<Props>) {
    return <div className="input-wrapper">
        <label>{label}</label>
        {children}
    </div>
}