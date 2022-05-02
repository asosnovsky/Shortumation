import { AutomationSequenceNode } from 'types/automations';
import { DAGFlowDims, FlowData } from './types';
import { getDescriptionFromAutomationNode } from 'utils/formatting';
import { XYPosition } from 'react-flow-renderer';
import { ChooseAction } from 'types/automations/actions';
import { DAGCircleProps, makeFlowCircle } from './DAGCircle';


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
            position = {
                x: lasPos.x + dims.nodeWidth * dims.distanceFactor,
                y: dims.padding.y
            }
        } else {
            position = {
                x: dims.padding.x + dims.nodeWidth * dims.distanceFactor * (i + 2),
                y: dims.padding.y
            };
        }
        if (node.$smType === 'action') {
            if (node.action === 'choose') {
                position = addChooseNode(flowData, node, position, nodeId, dims)
            } else {
                addSingleNode(flowData, node, position, nodeId, dims);
            }
        } else {
            addSingleNode(flowData, node, position, nodeId, dims);

        }
        addEdge(flowData, lastPointId, nodeId, false)
        lastPointId = nodeId;
        lasPos = position;
    }
    return {
        position: lasPos,
        pointId: lastPointId,
    };
}

const xyApply = (p1: XYPosition, p2: XYPosition, fcn: (a: number, b: number) => number): XYPosition => ({
    x: fcn(p1.x, p2.x), y: fcn(p1.y, p2.y)
})

const addEdge = (flowData: FlowData, source: string, target: string, animated: boolean = false) => flowData.edges.push({
    id: `${source}-${target}`,
    source,
    target,
    animated,
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
    dims: DAGFlowDims,
) => {
    addSingleNode(flowData, node, position, nodeId, dims);
    let lastPos: XYPosition = position;
    // conditions
    node.action_data.choose.forEach(({ sequence, conditions }, j) => {
        const sequenceId = `${nodeId}.${j}`;
        const circle = makeFlowCircle(`${sequenceId}>cond`, {
            x: position.x + dims.nodeWidth * dims.distanceFactor,
            y: lastPos.y + dims.nodeHeight * dims.distanceFactor,
        }, { size: dims.circleSize * dims.distanceFactor, onEdit: () => { }, onRemove: () => { } })
        flowData.nodes.push(circle)
        addEdge(flowData, nodeId, circle.id, true)
        const lastPoint = sequenceToFlow(flowData, sequence, circle.id, {
            ...dims,
            padding: {
                x: position.x - dims.nodeWidth,
                y: circle.position.y,
            },
        }, `${sequenceId}.`);
        if (lastPoint.position) {
            lastPos = xyApply(lastPos, lastPoint.position, Math.max)
        }
    })
    const totalChildren = node.action_data.choose.length;
    // add button
    const addCirlce = makeFlowCircle(
        `${nodeId}>add`, {
        x: position.x + dims.nodeWidth * dims.distanceFactor,
        y: lastPos.y + dims.nodeHeight * (totalChildren + 0.25) * dims.distanceFactor,
    },
        {
            size: dims.circleSize * dims.distanceFactor,
            onAdd: () => { },
            disableSource: true,
            disableTarget: true,
        }
    );
    flowData.nodes.push(addCirlce)
    addEdge(flowData, nodeId, addCirlce.id, true)

    // default
    const elseCircle = makeFlowCircle(`${nodeId}>else`, {
        x: position.x + dims.nodeWidth * dims.distanceFactor,
        y: lastPos.y + dims.nodeHeight * (totalChildren + 0.25 + 1) * dims.distanceFactor,
    }, { size: dims.circleSize * dims.distanceFactor })
    flowData.nodes.push(elseCircle)
    addEdge(flowData, nodeId, elseCircle.id, true)
    const lastPoint = sequenceToFlow(flowData, node.action_data.default, elseCircle.id, {
        ...dims,
        padding: {
            x: position.x - dims.nodeWidth,
            y: elseCircle.position.y,
        },
    }, `${nodeId}.${totalChildren}.`)
    if (lastPoint.position) {
        lastPos = xyApply(lastPos, lastPoint.position, Math.max)
    }
    return lastPos
}