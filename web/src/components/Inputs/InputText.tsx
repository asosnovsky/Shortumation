import { useToolTip } from "~/tooltip/context";
import InputWrapper from "./InputWrapper";
import { useInputTextStyles } from "./styles";

export interface Props {
    textBoxFor?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    additionalTooltipFilters?: Record<string, string>;
}
export default function InputText({
    label, 
    textBoxFor, 
    value="", 
    onChange,
    additionalTooltipFilters={},
}: Props) {
    const {classes} = useInputTextStyles({});
    const tooltip = useToolTip();
    return <InputWrapper label={label} labelSize={value === '' ? 'normal' : 'small'}>
        <input 
            className={classes.input}
            value={value} 
            onChange={e => {
                e.preventDefault();
                onChange(e.target.value)
            }} 
            onFocus={e => textBoxFor && tooltip.setFocus(
                e.target.getBoundingClientRect(),
                {
                    searchObject: textBoxFor,
                    searchText: value,
                    filterObjects: additionalTooltipFilters,
                },
                onChange
            )}
        />
    </InputWrapper>
}