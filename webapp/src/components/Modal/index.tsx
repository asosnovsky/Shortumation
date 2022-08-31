import "./index.css";
import MuiModal from "@mui/material/Modal";
import { FC, ReactNode } from "react";
import { Card, CardContent } from "@mui/material";
import useWindowSize from "utils/useWindowSize";

export interface ModalStyleProps {
  open: boolean;
}
export interface Props extends ModalStyleProps {
  children: ReactNode;
  className?: string;
}
export const Modal: FC<Props> = ({ children, open, className }) => {
  const { isMobile } = useWindowSize();
  return (
    <MuiModal open={open}>
      <div className={["modal--root", isMobile ? "mobile" : ""].join(" ")}>
        <Card variant="outlined">
          <CardContent className={className}>{children}</CardContent>
        </Card>
      </div>
    </MuiModal>
  );
};
