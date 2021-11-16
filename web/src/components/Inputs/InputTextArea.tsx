import { useState } from "react";
import { useToolTip } from "~/tooltip/context";
import InputWrapper from "./InputWrapper";
import { useInputTextAreaStyles } from "./styles";

export interface Props {
    textBoxFor?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    additionalTooltipFilters?: Record<string, string>;
    resizable?: boolean;
}
export default function InputTextArea({
    label, 
    textBoxFor, 
    value="", 
    onChange,
    additionalTooltipFilters={},
    resizable=false,
}: Props) {
    const {classes} = useInputTextAreaStyles({ resizable });
    const tooltip = useToolTip();
    const [isFocused, setIsFocused] = useState(false)
    return <InputWrapper label={label} labelSize={(value === '') && !isFocused ? 'normal' : 'small'}>
        <textarea 
            className={classes.input}
            value={value} 
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
    </InputWrapper>
}