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
};
export type SequenceNodeOnMoveEvents = Partial<
  SequenceNodeOnMove<"up" | "down" | "left" | "right">
>;
export type SequenceNodeBaseProps = Partial<SequenceNodeActions> & {
  color: SequenceNodeColor;
  label: ReactNode;
  enabled: boolean;
};
export type SequenceNodeElementProps = SequenceNodeBaseProps & {
  height: number;
  width: number;
  flipped: boolean;
};
export type SequenceNodeDataProps = SequenceNodeBaseProps & {
  hasInput?: boolean;
};
export interface SequenceNodeProps extends SequenceNodeDataProps {
  height: number;
  width: number;
  flipped: boolean;
}
