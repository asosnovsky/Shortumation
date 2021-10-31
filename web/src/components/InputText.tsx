import InputWrapper from "./InputWrapper";


export interface Props {
    label: string;
    value: string;
    onChange: (v: string) => void;
}
export default function InputText({
    label, value, onChange
}: Props) {
    return <InputWrapper label={label}>
        <input value={value} onChange={e => {
            e.preventDefault();
            onChange(e.target.value)
        }}/>
    </InputWrapper>
}