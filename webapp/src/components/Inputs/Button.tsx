import { ButtonHTMLAttributes, FC } from "react";
import { useButtonStyles } from "./styles";

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  const { classes } = useButtonStyles({});
  return <button {...props} className={`${classes.input} ${props.className ?? ''}`} />
}
