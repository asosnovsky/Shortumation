import { AutomationSequenceNode } from 'types/automations';
import { DAGAutomationFlowDims, FlowData } from './types';
import { getDescriptionFromAutomationNode } from 'utils/formatting';
import { XYPosition } from 'react-flow-renderer';
import { ChooseAction } from 'types/automations/actions';
import { makeFlowCircle } from './DAGCircle';
import { createOnRemoveForChooseNode, SequenceUpdater } from './updater';
import { getNodeType } from 'utils/automations';
import { makeAddButton, makeConditionPoint } from './flowDataMods';


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
        if (getNodeType(node) === 'action') {
            if ('choose' in node) {
                try {
                    const out = addChooseNode(node, position, nodeId, dims, updater, i);
                    position = out.lastPos
                    flowData = mergeFlowDatas(flowData, out.flowData);
                } catch (err) {
                    console.error(err)
                    addErrorNode(flowData, nodeId, position, dims, err, updater.makeOnEditForBadNode(i));
                }
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
    const addCircle = makeAddButton(
        `${prefix}-+`,
        {
            x: (
                lasPos === null ?
                    dims.padding.x + dims.nodeWidth * dims.distanceFactor * (sequence.length + 1) :
                    lasPos.x
            ) + dims.nodeWidth * dims.distanceFactor,
            y: dims.padding.y + dims.circleSize / 4
        },
        dims,
        updater.addNode,
        false,
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
        color: getNodeType(node) === 'action' ? 'green' : 'blue',
        hasInput: true,
        ...opts,
    },
    position,
});

const addErrorNode = (
    flowData: FlowData,
    nodeId: string,
    position: XYPosition,
    {
        nodeHeight,
        nodeWidth,
    }: DAGAutomationFlowDims,
    error: any,
    onEdit: () => void,
    hasInput: boolean = true,
) => flowData.nodes.push({
    id: nodeId,
    type: 'errornode',
    position,
    data: {
        height: nodeHeight,
        width: nodeWidth,
        hasInput,
        onEdit,
        error,
    }
})



const addChooseNode = (
    node: ChooseAction,
    position: XYPosition,
    nodeId: string,
    dims: DAGAutomationFlowDims,
    updater: SequenceUpdater,
    i: number,
) => {
    const flowData: FlowData = {
        nodes: [],
        edges: [],
    };
    addSingleNode(flowData, node, position, nodeId, dims, {
        onEditClick: updater.makeOnModalOpenForNode(i, node),
        onXClick: () => updater.removeNode(i),
    });
    let lastPos: XYPosition = position;
    // conditions
    node.choose.forEach(({ sequence, conditions }, j) => {
        const sequenceId = `${nodeId}.${j}`;
        // edit/delete circle
        const circle = makeFlowCircle(`${sequenceId}>delete`, {
            x: position.x + dims.nodeWidth * dims.distanceFactor,
            y: lastPos.y + dims.nodeHeight * dims.distanceFactor,
        }, {
            size: dims.circleSize,
            onRemove: createOnRemoveForChooseNode(
                node,
                d => updater.updateNode(i, d),
                j,
            ),
        })
        flowData.nodes.push(circle)
        addEdge(flowData, nodeId, circle.id, true)
        const condNode = makeConditionPoint(
            `${sequenceId}>cond`,
            {
                x: circle.position.x + dims.circleSize * dims.distanceFactor,
                y: circle.position.y + dims.circleSize / 8,
            },
            dims,
            conditions.length,
            updater.makeOnEditConditionsForChooseNode(i, j)
        );
        flowData.nodes.push(condNode)
        addEdge(flowData, circle.id, condNode.id, true)

        // actual sub sequence
        const lastPoint = sequenceToFlow(flowData, sequence, condNode.id, {
            ...dims,
            padding: {
                x: condNode.position.x - (dims.nodeWidth + dims.conditionWidth),
                y: condNode.position.y - dims.conditionHeight / 2,
            },
        }, updater.makeChildUpdaterForChooseAction(i, j), `${sequenceId}.`);
        if (lastPoint.position) {
            lastPos = xyApply(lastPos, lastPoint.position, Math.max)
        } else {
            lastPos = xyApply(lastPos, { x: lastPos.x, y: lastPos.y + dims.nodeHeight * dims.distanceFactor }, Math.max)
        }
    })
    const totalChildren = node.choose.length;

    // add button
    const addCirlce = makeAddButton(
        `${nodeId}>add`,
        {
            x: position.x + dims.nodeWidth * dims.distanceFactor,
            y: lastPos.y + dims.nodeHeight * dims.distanceFactor,
        },
        dims,
        () => updater.updateNode(i, {
            ...node,
            choose: [
                ...node.choose,
                {
                    sequence: [],
                    conditions: [],
                }
            ]
        }),
        false,
    );
    flowData.nodes.push(addCirlce)
    addEdge(flowData, nodeId, addCirlce.id, true)

    // else
    const elseCircle = makeFlowCircle(`${nodeId}>else`, {
        x: position.x + dims.nodeWidth * dims.distanceFactor,
        y: lastPos.y + dims.nodeHeight * dims.distanceFactor * 2,
    }, { size: dims.circleSize })
    flowData.nodes.push(elseCircle)
    addEdge(flowData, nodeId, elseCircle.id, true)
    const lastPoint = sequenceToFlow(flowData, node.default ?? [], elseCircle.id, {
        ...dims,
        padding: {
            x: position.x - dims.nodeWidth,
            y: elseCircle.position.y - dims.circleSize / 4,
        },
    }, updater.makeChildUpdaterForChooseAction(i, null), `${nodeId}.${totalChildren}.`)
    if (lastPoint.position) {
        lastPos = xyApply(lastPos, lastPoint.position, Math.max)
    } else {
        lastPos = xyApply(lastPos, elseCircle.position, Math.max)
    }
    return { lastPos, flowData }
}

export const mergeFlowDatas = (fd1: FlowData, fd2: FlowData): FlowData => {
    fd1.edges = fd1.edges.concat(fd2.edges);
    fd1.nodes = fd1.nodes.concat(fd2.nodes);
    return fd1
}