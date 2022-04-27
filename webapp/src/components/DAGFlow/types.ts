import { Edge, Node } from 'react-flow-renderer';
import { AutomationTrigger } from 'types/automations/triggers';
import { DAGCircleProps } from './DAGCircle';
import { DAGNodeProps } from './DAGNode';


export type DAGFlowDims = {
    padding: number;
    nodeHeight: number;
    nodeWidth: number;
    // addHeight: number;
    // addWidth: number;
    circleSize: number;
    distanceFactor: number;
}

export type FlowData = {
    nodes: Node[],
    edges: Edge[],
}

export type TriggerMakerOptions = {
    onAdd: () => void,
    onEdit: (i: number) => void,
    onDelete: (i: number) => void,
}
export type DAGFlowNode = Node<DAGNodeProps | DAGCircleProps>;