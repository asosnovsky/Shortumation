import "./index.css";
import MuiModal from "@mui/material/Modal";
import { FC, ReactNode } from "react";
import { Card, CardContent } from "@mui/material";

export interface ModalStyleProps {
  open: boolean;
}
export interface Props extends ModalStyleProps {
  children: ReactNode;
}
export const Modal: FC<Props> = ({ children, open }) => {
  return (
    <MuiModal open={open}>
      <div className="modal--root">
        <Card variant="outlined">
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </MuiModal>
  );
};
