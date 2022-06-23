import { DAGCircleProps, makeFlowCircle } from "./DAGCircle";
import { DAGAutomationFlowDims } from "./types";
import { Node, XYPosition } from "react-flow-renderer";

export const makeAddButton = (
  id: string,
  position: XYPosition,
  { circleSize, flipped }: DAGAutomationFlowDims,
  onAdd: () => void,
  disableTarget: boolean = true
): Node<DAGCircleProps> =>
  makeFlowCircle(id, position, {
    flipped,
    size: circleSize,
    onAdd,
    disableSource: true,
    disableTarget,
  });
