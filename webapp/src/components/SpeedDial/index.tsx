import "./index.css";
import { FC, ReactNode, useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";

export type SpeedDialProps = {
  icon: ReactNode;
  className?: string;
  children: ReactNode;
  direction?: "row" | "column";
};
export const SpeedDial: FC<SpeedDialProps> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div
        className={["speed-dial", props.className ?? ""].join(" ")}
        onClick={() => setOpen(!open)}
      >
        <div
          className={["speed-dial--icon", open ? "open" : "close"].join(" ")}
        >
          {props.icon}
        </div>
        <div
          className={[
            "speed-dial--list",
            open ? "open" : "close",
            props.direction ?? "row",
          ].join(" ")}
        >
          {props.children}
        </div>
      </div>
    </ClickAwayListener>
  );
};
