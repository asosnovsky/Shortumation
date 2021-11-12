import { useRef, useState, useEffect } from "react";
import CheckMarkIcon from "~/icons/checkmark";
import PencilIcon from "~/icons/pencil";
import { useToolTip } from "~/tooltip/context";
import InputWrapper from "./InputWrapper";

export interface Props {
    textBoxFor?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    additionalTooltipFilters?: Record<string, string>;
}
export default function InputViewEdit({
    label, 
    textBoxFor, 
    value="", 
    onChange,
    additionalTooltipFilters={},
}: Props) {
    const tooltip = useToolTip();
    const [isEditing, setIsEditing] = useState(false);
    const onChangeWrapped = (t: string) => {
        onChange(t);
        setIsEditing(false);
    }
    const inputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [inputRef.current, isEditing])
    return <InputWrapper label={label}>
        {isEditing ? <input 
            ref={inputRef}
            value={value} 
            onChange={e => {
                e.preventDefault();
                onChangeWrapped(e.target.value)
            }} 
            onFocus={e => textBoxFor && tooltip.setFocus(
                e.target.getBoundingClientRect(),
                {
                    searchObject: textBoxFor,
                    searchText: value,
                    filterObjects: additionalTooltipFilters,
                },
                onChangeWrapped
            )}
        />:<div className="input-view">
            {value}
        </div>}
        <PencilIcon onClick={() => setIsEditing(!isEditing)} className={`icon pencil ${isEditing ? 'opened' : ''}`}/>
        <CheckMarkIcon onClick={() => setIsEditing(!isEditing)} className={`icon checkmark ${isEditing ? 'opened' : ''}`}/>
    </InputWrapper>
}