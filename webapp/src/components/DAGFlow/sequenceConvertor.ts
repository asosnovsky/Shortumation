import { AutomationSequenceNode } from 'types/automations';
import { DAGAutomationFlowDims, FlowData } from './types';
import { getDescriptionFromAutomationNode } from 'utils/formatting';
import { XYPosition } from 'react-flow-renderer';
import { ChooseAction } from 'types/automations/actions';
import { makeFlowCircle } from './DAGCircle';
import { createOnRemoveForChooseNode, SequenceUpdater } from './updater';


export const sequenceToFlow = (
    flowData: FlowData,
    sequence: AutomationSequenceNode[],
    fromPoint: string,
    dims: DAGAutomationFlowDims,
    updater: SequenceUpdater,
    prefix: string = "",
) => {
    let lastPointId = fromPoint;
    let lasPos: XYPosition | null = null;
    // sequence
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
        // draw node
        if (node.$smType === 'action') {
            if (node.action === 'choose') {
                position = addChooseNode(flowData, node, position, nodeId, dims, updater, i)
            } else {
                addSingleNode(flowData, node, position, nodeId, dims, {
                    onEditClick: updater.makeOnModalOpenForNode(i, node),
                    onXClick: () => updater.removeNode(i)
                });
            }
        } else {
            addSingleNode(flowData, node, position, nodeId, dims, {
                onEditClick: updater.makeOnModalOpenForNode(i, node),
                onXClick: () => updater.removeNode(i)
            });

        }
        addEdge(flowData, lastPointId, nodeId, false)
        lastPointId = nodeId;
        lasPos = position;
    }
    // add button
    const addCircle = makeFlowCircle(
        `${prefix}-+`,
        {
            x: (lasPos === null ? dims.padding.x + dims.nodeWidth * dims.distanceFactor * (sequence.length + 1) : lasPos.x) + dims.nodeWidth * dims.distanceFactor,
            y: dims.padding.y + dims.circleSize / 2
        },
        { onAdd: updater.addNode, size: dims.circleSize, disableSource: true, }
    )
    flowData.nodes.push(addCircle)
    addEdge(flowData, lastPointId, addCircle.id, false)
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
    }: DAGAutomationFlowDims,
    opts: {
        onEditClick: () => void;
        onXClick: () => void;
    }
) => flowData.nodes.push({
    id: nodeId,
    type: 'dagnode',
    data: {
        label: getDescriptionFromAutomationNode(node),
        height: nodeHeight,
        width: nodeWidth,
        color: node.$smType === 'action' ? 'green' : 'blue',
        hasInput: true,
        ...opts,
    },
    position,
});



const addChooseNode = (
    flowData: FlowData,
    node: ChooseAction,
    position: XYPosition,
    nodeId: string,
    dims: DAGAutomationFlowDims,
    updater: SequenceUpdater,
    i: number,
) => {
    addSingleNode(flowData, node, position, nodeId, dims, {
        onEditClick: updater.makeOnModalOpenForNode(i, node),
        onXClick: () => updater.removeNode(i),
    });
    let lastPos: XYPosition = position;
    // conditions
    node.action_data.choose.forEach(({ sequence, conditions }, j) => {
        const sequenceId = `${nodeId}.${j}`;
        // edit/delete circle
        const circle = makeFlowCircle(`${sequenceId}>cond`, {
            x: position.x + dims.nodeWidth * dims.distanceFactor,
            y: lastPos.y + dims.nodeHeight * dims.distanceFactor,
        }, {
            size: dims.circleSize * dims.distanceFactor,
            onEdit: updater.makeOnEditConditionsForChooseNode(i, j),
            onRemove: createOnRemoveForChooseNode(
                node,
                d => updater.updateNode(i, d),
                j,
            ),
        })
        flowData.nodes.push(circle)
        addEdge(flowData, nodeId, circle.id, true)
        // actual sub sequence
        const lastPoint = sequenceToFlow(flowData, sequence, circle.id, {
            ...dims,
            padding: {
                x: position.x - dims.nodeWidth,
                y: circle.position.y,
            },
        }, updater.makeChildUpdaterForChooseAction(i, j), `${sequenceId}.`);
        if (lastPoint.position) {
            lastPos = xyApply(lastPos, lastPoint.position, Math.max)
        } else {
            lastPos = xyApply(lastPos, { x: lastPos.x, y: lastPos.y + dims.nodeHeight * dims.distanceFactor }, Math.max)
        }
    })
    const totalChildren = node.action_data.choose.length;

    // add button
    const addCirlce = makeFlowCircle(
        `${nodeId}>add`, {
        x: position.x + dims.nodeWidth * dims.distanceFactor,
        y: lastPos.y + dims.nodeHeight * dims.distanceFactor,
    },
        {
            size: dims.circleSize * dims.distanceFactor,
            onAdd: () => updater.updateNode(i, {
                ...node,
                action_data: {
                    ...node.action_data,
                    choose: [
                        ...node.action_data.choose,
                        {
                            sequence: [],
                            conditions: [],
                        }
                    ]
                }
            }),
            disableSource: true,
        }
    );
    flowData.nodes.push(addCirlce)
    addEdge(flowData, nodeId, addCirlce.id, true)

    // default
    const elseCircle = makeFlowCircle(`${nodeId}>else`, {
        x: position.x + dims.nodeWidth * dims.distanceFactor,
        y: lastPos.y + dims.nodeHeight * dims.distanceFactor * 2,
    }, { size: dims.circleSize * dims.distanceFactor })
    flowData.nodes.push(elseCircle)
    addEdge(flowData, nodeId, elseCircle.id, true)
    const lastPoint = sequenceToFlow(flowData, node.action_data.default, elseCircle.id, {
        ...dims,
        padding: {
            x: position.x - dims.nodeWidth,
            y: elseCircle.position.y,
        },
    }, updater.makeChildUpdaterForChooseAction(i, null), `${nodeId}.${totalChildren}.`)
    if (lastPoint.position) {
        lastPos = xyApply(lastPos, lastPoint.position, Math.max)
    } else {
        lastPos = xyApply(lastPos, elseCircle.position, Math.max)
    }
    return lastPos
}