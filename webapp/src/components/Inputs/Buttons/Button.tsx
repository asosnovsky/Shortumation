import { FC, ReactNode } from "react";
import MuiButton, { ButtonProps as MuiButtonProps } from "@mui/material/Button";

export const Button: FC<{
  className?: string;
  title?: string;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  color?: MuiButtonProps["color"];
}> = (props) => {
  return (
    <MuiButton
      className={props.className}
      title={props.title}
      disabled={props.disabled}
      onClick={props.onClick}
      variant="outlined"
      children={props.children}
      color={props.color}
    />
  );
};
