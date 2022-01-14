import { DAGBoardElmDims, DAGElement } from "components/DAGSvgs/DAGBoard";
import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";

export type UpdateModalState = (
  s: ModalState
) => void;

export interface SequenceNodeProps {
  startPoint: Point;
  dims: DAGBoardElmDims;
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void;
  additionalElements?: () => Generator<DAGElement>;
}

export type ModalState = {
  single: true,
  node: AutomationSequenceNode
  update: (n: AutomationSequenceNode) => void;
  saveBtnCreateText?: boolean;
  onlyConditions: boolean;
} | {
  single: false,
  node: AutomationSequenceNode[]
  update: (n: AutomationSequenceNode[]) => void;
  onlyConditions: boolean;
}
