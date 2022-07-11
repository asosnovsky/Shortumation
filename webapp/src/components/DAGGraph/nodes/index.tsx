import { Node, NodeTypes } from "react-flow-renderer";
import { NodeManager } from "./NodeManager";
import { CollectionNodeProps } from "./CollectionNode/types";
import { SequenceNodeProps } from "./SequenceNode/types";
import { ButtonNodeProps } from "./ButtonNode/types";

export const nodeTypes: NodeTypes = NodeManager.nodeTypes;
export type DAGAutomationFlowNode = Node<
  CollectionNodeProps | SequenceNodeProps | ButtonNodeProps
>;
