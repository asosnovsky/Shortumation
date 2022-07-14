import { Edge, XYPosition } from "react-flow-renderer";
import { AutomationNode } from "types/automations";
import { Namer } from "utils/formatting";
import { ModalState } from "../board/types";
import { DAGAutomationFlowNode } from "../nodes";
import { DAGGraphUpdater } from "../updater";
import { DAGElementsOutputState } from "./outputState";
import { DAGElementsState } from "./state";

export type Bbox = [XYPosition, XYPosition];
export type Size = { height: number; width: number };
export type ElementData = {
  nodes: DAGAutomationFlowNode[];
  edges: Edge[];
};
export type DAGEntityDim = Size;
export type DAGEntities = {
  node: DAGEntityDim;
  collection: DAGEntityDim;
};
export type DAGDims = DAGEntities & {
  position: XYPosition;
  distanceFactor: Record<keyof DAGEntities, number>;
  flipped: boolean;
};
export type ElementMakerBaseProps = {
  stateUpdater: DAGGraphUpdater;
  dims: DAGDims;
  namer: Namer;
  openModal: (m: ModalState) => void;
};
export type ElementMakerProps = ElementMakerBaseProps & {
  nodeId: string;
  nodeIndex: number;
  position: XYPosition;
  lastNodeId?: string;
  state: DAGElementsState;
};
export type LastNode = {
  nodeId: string;
  pos: XYPosition;
  size: Size;
};
export type ElementMaker<A extends AutomationNode = AutomationNode> = (
  haNodes: A[],
  args: ElementMakerProps
) => DAGElementsOutputState;
