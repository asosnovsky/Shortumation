import { useRef, useState, useEffect, HTMLProps } from "react";
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
    useTextArea?: boolean;
}
export default function InputViewEdit({
    label, 
    textBoxFor, 
    value="", 
    onChange,
    additionalTooltipFilters={},
    useTextArea=false,
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
    }, [inputRef.current, isEditing]);

    const Text = useTextArea ? (p: HTMLProps<any>) => <textarea {...p}/> : (p: HTMLProps<any>) => <input {...p}/>;

    return <InputWrapper label={label}>
        {isEditing ? <Text 
            ref={inputRef}
            value={value} 
            onChange={(e:any) => {
                onChangeWrapped(e.target.value)
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
        />:<div className="input-view">
            {value}
        </div>}
        <PencilIcon onClick={() => setIsEditing(!isEditing)} className={`icon pencil ${isEditing ? 'opened' : ''}`}/>
        <CheckMarkIcon onClick={() => setIsEditing(!isEditing)} className={`icon checkmark ${isEditing ? 'opened' : ''}`}/>
    </InputWrapper>
}