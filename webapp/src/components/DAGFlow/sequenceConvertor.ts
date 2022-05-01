import { AutomationSequenceNode } from 'types/automations';
import { DAGFlowDims, FlowData } from './types';
import { getDescriptionFromAutomationNode } from 'utils/formatting';
import { XYPosition } from 'react-flow-renderer';
import { ChooseAction } from 'types/automations/actions';


export const sequenceToFlow = (
    flowData: FlowData,
    sequence: AutomationSequenceNode[],
    fromPoint: string,
    dims: DAGFlowDims,
    prefix: string = "",
) => {
    let lastPointId = fromPoint;
    for (let i = 0; i < sequence.length; i++) {
        const node = sequence[i];
        const nodeId = `${prefix}n-${i}`;
        const position = computeNodePos(i, dims);
        if (node.$smType === 'action') {
            if (node.action === 'choose') {
                addChooseNode(flowData, node, i, nodeId, lastPointId, dims)
            } else {
                addSingleNode(flowData, node, position, nodeId, dims);
            }
        } else {
            addSingleNode(flowData, node, position, nodeId, dims);

        }
        flowData.edges.push({
            id: `${lastPointId}-${nodeId}`,
            source: lastPointId,
            target: nodeId,
        });
        lastPointId = nodeId;
    }
}

const computeNodePos = (i: number, { padding, distanceFactor, nodeWidth }: DAGFlowDims): XYPosition => ({
    x: padding.x + nodeWidth * distanceFactor * (i + 2),
    y: padding.y
})

const addSingleNode = (
    flowData: FlowData,
    node: AutomationSequenceNode,
    position: XYPosition,
    nodeId: string,
    {
        nodeHeight,
        nodeWidth,
    }: DAGFlowDims,
    extra: Record<string, any> = {},
) => flowData.nodes.push({
    id: nodeId,
    type: 'dagnode',
    data: {
        label: getDescriptionFromAutomationNode(node),
        height: nodeHeight,
        width: nodeWidth,
        color: node.$smType === 'action' ? 'green' : 'blue',
        // onEdit: () => opts.onEdit(i),
        // onXClick: () => opts.onDelete(i, flowId),
        hasInput: true,
    },
    position,
    ...extra
});


const addChooseNode = (
    flowData: FlowData,
    node: ChooseAction,
    i: number,
    nodeId: string,
    lastPointId: string,
    dims: DAGFlowDims,
) => {
    const { x, y } = computeNodePos(i, dims);
    addSingleNode(flowData, node, { x, y }, nodeId, dims);
    node.action_data.choose.forEach(({ sequence, conditions }, j) => {
        sequenceToFlow(flowData, sequence, nodeId, {
            ...dims,
            padding: {
                x: x - dims.nodeWidth,
                y: y + dims.nodeHeight * (j + 0.25) * dims.distanceFactor,
            },
        }, `${nodeId}.${j}.`)
    })
    const totalChildren = node.action_data.choose.length;
    sequenceToFlow(flowData, node.action_data.default, nodeId, {
        ...dims,
        padding: {
            x: x - dims.nodeWidth,
            y: y + dims.nodeHeight * (totalChildren + 0.25) * dims.distanceFactor,
        },
    }, `${nodeId}.${totalChildren}.`)
}