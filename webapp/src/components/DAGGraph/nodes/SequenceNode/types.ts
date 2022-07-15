import { ReactNode } from "react";

export type SequenceNodeColor = "red" | "blue" | "green" | "lblue";
export type SequenceNodeOnMove<Direction extends string> = Record<
  Direction,
  () => void
>;
export type SequenceNodeActions = {
  onXClick: () => void;
  onEditClick: () => void;
  onSetEnabled: () => void;
  onAddNode: () => void;
  onMove: SequenceNodeOnMoveEvents;
  onAdd: SequenceNodeOnMoveEvents;
  setIsClosed: (isClosed: boolean) => void;
};
export type SequenceNodeOnMoveEvents = Partial<
  SequenceNodeOnMove<"up" | "down" | "left" | "right">
>;
export type SequenceNodeBaseProps = Partial<SequenceNodeActions> & {
  color: SequenceNodeColor;
  label: ReactNode;
  enabled: boolean;
  isClosed?: boolean;
};
export type SequenceNodeElementProps = SequenceNodeBaseProps & {
  height: number;
  width: number;
  flipped: boolean;
};
export type SequenceNodeDataProps = SequenceNodeBaseProps & {};
export interface SequenceNodeProps extends SequenceNodeDataProps {
  height: number;
  width: number;
  flipped: boolean;
}
