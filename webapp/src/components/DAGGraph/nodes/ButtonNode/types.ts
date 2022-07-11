import { ReactNode } from "react";

export type ButtonNodeDataProps = {
  icon: ReactNode;
  onClick: () => void;
};

export type ButtonNodeProps = ButtonNodeDataProps & {
  width: number;
  height: number;
  flipped: boolean;
};
