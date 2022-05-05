import { Edge, Node, XYPosition } from 'react-flow-renderer';
import { AutomationSequenceNode } from 'types/automations';
import { DAGCircleProps } from './DAGCircle';
import { DAGNodeProps } from './DAGNode';
import { AutomationTrigger } from 'types/automations/triggers';
import { MultiNodeEditorProps } from 'components/MultiNodeEditors';


export type DAGAutomationFlowDims = {
    padding: XYPosition;
    nodeHeight: number;
    nodeWidth: number;
    circleSize: number;
    distanceFactor: number;
}

export type DAGAutomationFlowNode = Node<DAGNodeProps | DAGCircleProps | any>;
export type FlowData = {
    nodes: DAGAutomationFlowNode[],
    edges: Edge[],
}

export type TriggerMakerOptions = {
    onAdd: () => void,
    onEdit: (i: number) => void,
    onDelete: (i: number) => void,
}

export type UpdateModalState<T extends AutomationSequenceNode | AutomationTrigger = any> = (
    s: ModalState<T>
) => void;

export type ModalState<T extends AutomationSequenceNode | AutomationTrigger = any> = {
    single: true,
    node: T
    update: (n: T) => void;
    saveBtnCreateText?: boolean;
    allowedTypes: MultiNodeEditorProps['allowedTypes'],
} | {
    single: false,
    node: AutomationSequenceNode[]
    update: (n: AutomationSequenceNode[]) => void;
    allowedTypes: ['condition']
}
