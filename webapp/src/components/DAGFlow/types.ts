import { Edge, Node, XYPosition } from 'react-flow-renderer';
import { DAGCircleProps } from './DAGCircle';
import { DAGNodeProps } from './DAGNode';


export type DAGFlowDims = {
    padding: XYPosition;
    nodeHeight: number;
    nodeWidth: number;
    // addHeight: number;
    // addWidth: number;
    circleSize: number;
    distanceFactor: number;
}

export type DAGFlowNode = Node<DAGNodeProps | DAGCircleProps | any>;
export type FlowData = {
    nodes: DAGFlowNode[],
    edges: Edge[],
}

export type TriggerMakerOptions = {
    onAdd: () => void,
    onEdit: (i: number) => void,
    onDelete: (i: number) => void,
}