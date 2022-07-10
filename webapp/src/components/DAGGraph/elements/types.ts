import { Edge, XYPosition } from "react-flow-renderer";
import { AutomationNode } from "types/automations";
import { Namer } from "utils/formatting";
import { ModalState } from "../board/types";
import { DAGAutomationFlowNode } from "../nodes";
import { DAGGraphUpdater } from "../updater";

export type Bbox = [XYPosition, XYPosition];
export type Size = { height: number; width: number };
export type ElementData = {
  nodes: DAGAutomationFlowNode[];
  edges: Edge[];
};
export type DAGEntityDim = Size;
export type DAGEntities = {
  node: DAGEntityDim;
  circle: DAGEntityDim;
  condition: DAGEntityDim;
  trigger: DAGEntityDim;
};
export type DAGDims = DAGEntities & {
  position: XYPosition;
  distanceFactor: {
    node: number;
    collection: number;
  };
  flipped: boolean;
};
export type ElementMakerBaseProps = {
  stateUpdater: DAGGraphUpdater;
  dims: DAGDims;
  namer: Namer;
  openModal: (m: ModalState) => void;
};
export type ElementMakerProps = ElementMakerBaseProps & {
  elementData: ElementData;
  nodeId: string;
  nodeIndex: number;
  position: XYPosition;
  lastNodeId?: string;
};
export type LastNode = {
  nodeId: string;
  pos: XYPosition;
  size: Size;
};
export type ElementMakerOutput = {
  elementData: ElementData;
  lastNode: LastNode;
};

export type ElementMaker<A extends AutomationNode = AutomationNode> = (
  haNodes: A[],
  args: ElementMakerProps
) => ElementMakerOutput;
