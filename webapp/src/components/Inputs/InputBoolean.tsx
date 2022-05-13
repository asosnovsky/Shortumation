import "./InputBoolean.css";
import InputWrapper from "./InputWrapper";

export interface Props {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}
export default function InputBoolean({
  label,
  value = false,
  onChange,
}: Props) {
  return <div className="input-boolean" onClick={() => onChange(!value)}>
    <input type="checkbox" checked={value} onChange={() => { }} />
    <label>{label}</label>
  </div>
}
