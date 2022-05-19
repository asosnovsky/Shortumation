import "./InputBoolean.css";

export interface Props {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}
export default function InputBoolean({
  label,
  value = false,
  onChange,
  disabled = false,
}: Props) {
  return <div className={["input-boolean", disabled ? 'disabled' : ''].join(' ')} onClick={() => onChange(!value)}>
    <input type="checkbox" checked={value} onChange={() => { }} disabled={disabled} />
    <label>{label}</label>
  </div>
}
