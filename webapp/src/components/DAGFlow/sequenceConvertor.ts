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
    let lasPos: XYPosition | null = null;
    for (let i = 0; i < sequence.length; i++) {
        const node = sequence[i];
        const nodeId = `${prefix}n-${i}`;
        let position: XYPosition;
        if (lasPos) {
            position = { x: lasPos.x + dims.nodeWidth * dims.distanceFactor, y: dims.padding.y }
        } else {
            position = computeNodePos(i, dims);
        }
        if (node.$smType === 'action') {
            if (node.action === 'choose') {
                position = addChooseNode(flowData, node, position, nodeId, lastPointId, dims)
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
        lasPos = position;
    }
    return {
        position: lasPos,
        pointId: lastPointId,
    };
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
    position: XYPosition,
    nodeId: string,
    lastPointId: string,
    dims: DAGFlowDims,
) => {
    addSingleNode(flowData, node, position, nodeId, dims);
    let lastPos: XYPosition = position;
    node.action_data.choose.forEach(({ sequence, conditions }, j) => {
        const { y } = lastPos;
        const lastPoint = sequenceToFlow(flowData, sequence, nodeId, {
            ...dims,
            padding: {
                x: position.x - dims.nodeWidth,
                y: y + dims.nodeHeight * dims.distanceFactor,
            },
        }, `${nodeId}.${j}.`);
        if (lastPoint.position) {
            lastPos = lastPoint.position;
        }
    })
    const totalChildren = node.action_data.choose.length;
    sequenceToFlow(flowData, node.action_data.default, nodeId, {
        ...dims,
        padding: {
            x: position.x - dims.nodeWidth,
            y: lastPos.y + dims.nodeHeight * (totalChildren + 0.25) * dims.distanceFactor,
        },
    }, `${nodeId}.${totalChildren}.`)
    return lastPos
}