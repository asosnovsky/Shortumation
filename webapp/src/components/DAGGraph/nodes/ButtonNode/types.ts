import { ReactNode } from "react";

export type ButtonNodeDataProps = {
  icon: ReactNode;
  onClick: () => void;
  text?: string;
};

export type ButtonNodeProps = ButtonNodeDataProps & {
  width: number;
  height: number;
  flipped: boolean;
};
