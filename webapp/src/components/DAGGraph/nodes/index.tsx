import { Node, NodeTypes } from "react-flow-renderer";
import { NodeManager } from "./NodeManager";

export const nodeTypes: NodeTypes = NodeManager.nodeTypes;
export type DAGAutomationFlowNode = Node<any>;
