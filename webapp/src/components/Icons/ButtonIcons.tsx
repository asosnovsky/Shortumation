import "./ButtonIcons.css";
import { FC, ReactNode } from "react";
import MuiIconButton, { IconButtonTypeMap } from "@mui/material/IconButton";

export type ButtonIconProps = {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  disabled?: boolean;
  color?: IconButtonTypeMap["props"]["color"];
};
export const ButtonIcon: FC<ButtonIconProps> = (props) => {
  return (
    <MuiIconButton
      className={["icon-button", props.className ?? ""].join(" ")}
      onClick={props.onClick}
      title={props.title}
      color={props.color}
      disabled={props.disabled}
    >
      {props.icon}
    </MuiIconButton>
  );
};
