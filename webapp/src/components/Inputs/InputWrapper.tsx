import { FC, ReactNode } from "react";
import { useInputWrapperStyles } from "./styles";


export interface Props {
  label: string;
  labelSize?: 'normal' | 'small';
  noMargin?: boolean;
  className?: string;
  error?: JSX.Element | string;
  children: ReactNode;
}
const InputWrapper: FC<Props> = ({ error, label, children, labelSize = 'normal', noMargin = false, className = "" }) => {
  const { classes } = useInputWrapperStyles({ labelSize, noMargin, hasError: !!error })
  return <div className={[classes.wrapper, className].join(" ")}>
    <label className={classes.label}>{label}</label>
    {children}
    <span className={classes.error}>{error}</span>
  </div>
}
export default InputWrapper;
