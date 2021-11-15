import { PropsWithChildren } from "react";
import { useInputWrapperStyles } from "./styles";


export interface Props {
    label: string;
    labelSize?: 'normal' | 'small';
}
export default function InputWrapper({label, children, labelSize='normal'}: PropsWithChildren<Props>) {
    const {classes} = useInputWrapperStyles({labelSize})
    return <div className={classes.wrapper}>
        <label className={classes.label}>{label}</label>
        {children}
    </div>
}