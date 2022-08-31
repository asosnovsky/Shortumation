import "./ButtonIcons.css";
import Tooltip from "@mui/material/Tooltip";
import { FC, ReactNode } from "react";
import IconButton, { IconButtonTypeMap } from "@mui/material/IconButton";
import { useLang } from "lang";

export type ButtonIconProps = {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  disabled?: boolean;
  color?: IconButtonTypeMap["props"]["color"];
  borderless?: boolean;
  titleSlug?: string;
  titleParams?: Record<string, string>;
};
export const ButtonIcon: FC<ButtonIconProps> = (props) => {
  const langStore = useLang();
  return (
    <Tooltip
      title={
        props.titleSlug ? langStore.get(props.titleSlug, props.titleParams) : ""
      }
      describeChild
    >
      <IconButton
        className={[
          "icon-button",
          props.className ?? "",
          props.borderless ? "borderless" : "",
        ].join(" ")}
        onClick={props.onClick}
        title={props.title}
        color={props.color}
        disabled={props.disabled}
      >
        {props.icon}
      </IconButton>
    </Tooltip>
  );
};
