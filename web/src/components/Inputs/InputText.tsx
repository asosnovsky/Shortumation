import { PropsWithChildren, useState } from "react";
import { useToolTip } from "~/tooltip/context";
import InputWrapper from "./InputWrapper";
import { useInputTextStyles } from "./styles";

export interface Props {
    textBoxFor?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    onEnter?: () => void;
    additionalTooltipFilters?: Record<string, string>;
}
export default function InputText({
    label, 
    textBoxFor, 
    value="", 
    onChange,
    onEnter=()=>{},
    additionalTooltipFilters={},
    children,
}: PropsWithChildren<Props>) {
    const {classes} = useInputTextStyles({});
    const tooltip = useToolTip();
    const [isFocused, setIsFocused] = useState(false)
    return <InputWrapper label={label} labelSize={(value === '') && !isFocused ? 'normal' : 'small'}>
        <input 
            className={classes.input}
            value={value} 
            onKeyDown={e => {
                if (e.key === 'Enter') {
                    onEnter();
                }
            }}
            onChange={e => {
                e.preventDefault();
                onChange(e.target.value)
            }} 
            onBlur={e => {
                setIsFocused(false)
            }}
            onFocus={e => {
                setIsFocused(true)
                if(textBoxFor) {
                    tooltip.setFocus(
                       e.target.getBoundingClientRect(),
                       {
                           searchObject: textBoxFor,
                           searchText: value,
                           filterObjects: additionalTooltipFilters,
                       },
                       onChange
                   )
                }
            }}
        />
        {children}
    </InputWrapper>
}