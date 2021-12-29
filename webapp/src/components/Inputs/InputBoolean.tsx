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
  return <InputWrapper label={label}>
    <span className="checkbox" onClick={e => {
      e.preventDefault()
      onChange(!value)
    }}>
      {value ? '✔️' : ' '}
    </span>
  </InputWrapper>
}
