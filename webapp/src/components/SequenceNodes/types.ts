import { DAGBoardElmDims } from "components/DAGSvgs/DAGBoard";
import { AutomationSequenceNode } from "types/automations";
import { Point } from "types/graphs";

export interface SequenceNodeProps {
  startPoint: Point;
  dims: DAGBoardElmDims;
  sequence: AutomationSequenceNode[],
  onChange: (s: AutomationSequenceNode[]) => void;
}

export type ModalState = {
  single: true,
  node: AutomationSequenceNode
  update: (n: AutomationSequenceNode) => void;
  onlyConditions: boolean;
} | {
  single: false,
  node: AutomationSequenceNode[]
  update: (n: AutomationSequenceNode[]) => void;
  onlyConditions: boolean;
}
