import { Edge, Node, XYPosition } from 'react-flow-renderer';
import { AutomationSequenceNode } from 'types/automations';
import { DAGCircleProps } from './DAGCircle';
import { DAGNodeProps } from './DAGNode';
import { AutomationTrigger } from 'types/automations/triggers';
import { MultiNodeEditorProps } from 'components/MultiNodeEditors/types';
import { DAGErrorNodeProps } from './DAGErrorNode';


export type DAGAutomationFlowDims = {
    padding: XYPosition;
    nodeHeight: number;
    nodeWidth: number;
    conditionWidth: number;
    conditionHeight: number;
    circleSize: number;
    distanceFactor: number;
}

export type DAGAutomationFlowNode = Node<DAGNodeProps | DAGCircleProps | DAGErrorNodeProps | any>;
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
    isError?: boolean,
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
