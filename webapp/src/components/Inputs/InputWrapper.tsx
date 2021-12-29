import { FC } from "react";
import { useInputWrapperStyles } from "./styles";


export interface Props {
  label: string;
  labelSize?: 'normal' | 'small';
  noMargin?: boolean;
}
const InputWrapper: FC<Props> = ({ label, children, labelSize = 'normal', noMargin = false }) => {
  const { classes } = useInputWrapperStyles({ labelSize, noMargin })
  return <div className={classes.wrapper}>
    <label className={classes.label}>{label}</label>
    {children}
  </div>
}
export default InputWrapper;
