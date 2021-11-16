import { useRef, useState, useEffect, HTMLProps } from "react";
import {CheckMarkIcon, PencilIcon} from "~/icons/icons";
import { useToolTip } from "~/tooltip/context";
import InputWrapper from "./InputWrapper";
import { useInputViewEditStyles } from "./styles";

export interface Props {
    textBoxFor?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    additionalTooltipFilters?: Record<string, string>;
    useTextArea?: boolean;
}
export default function InputViewEdit({
    label, 
    textBoxFor, 
    value="", 
    onChange,
    additionalTooltipFilters={},
}: Props) {
    // state
    const tooltip = useToolTip();
    const [isEditing, setIsEditing] = useState(false);
    // alias for on calls
    const onChangeWrapped = (t: string) => {
        onChange(t);
        setIsEditing(false);
    }
    // ref to grab focus when editing
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (isEditing && inputRef.current) {
            console.log('focusing...')
            inputRef.current.focus()
        }
    }, [inputRef.current, isEditing]);

    // styles
    const {classes} = useInputViewEditStyles({ isEditing });
    return <InputWrapper label={label}>
        {isEditing ? <input 
            ref={inputRef}
            value={value} 
            onChange={(e:any) => {
                onChange(e.target.value)
            }} 
            onFocus={(e: any) => textBoxFor && tooltip.setFocus(
                e.target.getBoundingClientRect(),
                {
                    searchObject: textBoxFor,
                    searchText: value,
                    filterObjects: additionalTooltipFilters,
                },
                onChangeWrapped
            )}
        />:<div className={classes.inputView}>
            {value}
        </div>}
        <PencilIcon onClick={() => setIsEditing(!isEditing)} className={classes.pencil}/>
        <CheckMarkIcon onClick={() => setIsEditing(!isEditing)} className={classes.checkmark}/>
    </InputWrapper>
}