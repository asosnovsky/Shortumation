import { PropsWithChildren } from "react";
import { useInputWrapperStyles } from "./styles";


export interface Props {
    label: string;
    labelSize?: 'normal' | 'small';
    noMargin?: boolean;
}
export default function InputWrapper({label, children, labelSize='normal', noMargin=false}: PropsWithChildren<Props>) {
    const {classes} = useInputWrapperStyles({labelSize, noMargin})
    return <div className={classes.wrapper}>
        <label className={classes.label}>{label}</label>
        {children}
    </div>
}