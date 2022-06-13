import Checkbox from "@mui/material/Checkbox";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export interface Props {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
}
export default function InputBoolean({
  label,
  value = false,
  onChange,
  disabled = false,
  className,
}: Props) {
  return <FormGroup className={className}>
    <FormControlLabel disabled={disabled} control={<Checkbox checked={value} onChange={() => onChange(!value)} />} label={label} />
  </FormGroup>
}
