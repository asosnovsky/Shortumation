import "./index.css";
import Paper from "@mui/material/Paper";
import MuiModal from "@mui/material/Modal";
import { FC, ReactNode } from "react";

export interface ModalStyleProps {
  open: boolean;
}
export interface Props extends ModalStyleProps {
  children: ReactNode;
}
export const Modal: FC<Props> = ({ children, ...props }) => {
  return (
    <MuiModal open={props.open}>
      <div className="modal--root">
        <Paper>{children}</Paper>
      </div>
    </MuiModal>
  );
};
