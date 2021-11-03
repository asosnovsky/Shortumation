import { useToolTip } from "../tooltip/context";
import InputWrapper from "./InputWrapper";

export interface Props {
    label: string;
    value: number;
    onChange: (v: number) => void;
}
export default function InputNumber({
    label, 
    value=0, 
    onChange,
}: Props) {
    const tooltip = useToolTip();
    return <InputWrapper label={label}>
        <input 
            type="number"
            value={value} 
            onChange={e => {
                e.preventDefault();
                onChange(Number(e.target.value))
            }} 
        />
    </InputWrapper>
}