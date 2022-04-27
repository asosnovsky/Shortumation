import { Edge, Node } from "react-flow-renderer";
import { AutomationTrigger } from 'types/automations/triggers';
import { DAGFlowDims, FlowData, TriggerMakerOptions, DAGFlowNode } from './types';

// export const makeTriggerMakerOptions = (
//     triggers: AutomationTrigger[],
//     onUpdate: (t: AutomationTrigger[]) => void,
// ): TriggerMakerOptions => ({
//     onAdd: () => onUpdate([...triggers, {
//         alias: "",

//     }])
// })

export const triggerToFlow = (
    trigger: AutomationTrigger[],
    {
        distanceFactor,
        nodeHeight,
        nodeWidth,
        circleSize,
        padding,
    }: DAGFlowDims,
    opts: TriggerMakerOptions,
): FlowData => {
    // outputs
    const nodes: DAGFlowNode[] = [],
        edges: Edge[] = [];

    // target node
    const condPos = { x: padding + nodeWidth * 2, y: padding + nodeHeight * 0.25 };
    nodes.push({
        id: `c`,
        type: 'dagcircle',
        position: condPos,
        data: {
            size: circleSize,
            backgroundColor: 'blue',
        }
    })

    // convert all triggers to dag nodes
    trigger.forEach((t, i) => {
        const flowId = `t-${i}`;
        nodes.push({
            id: flowId,
            type: 'dagnode',
            data: {
                label: t.alias ?? t.platform,
                height: nodeHeight,
                width: nodeWidth,
                color: 'red',
                onEdit: () => opts.onEdit(i),
                onXClick: () => opts.onDelete(i, flowId),
            },
            position: { x: padding, y: padding + nodeHeight * distanceFactor * i }
        })
        edges.push({
            id: `e(${flowId})-(c)`,
            source: flowId,
            target: 'c',
        })
    });

    // create a 'add button'
    nodes.push({
        id: `trigger-add`,
        type: 'dagcircle',
        position: {
            x: padding + nodeWidth * 0.4,
            y: padding + nodeHeight * distanceFactor * (nodes.length - 1),
        },
        data: {
            size: circleSize,
            backgroundColor: 'green',
            onAdd: opts.onAdd,
            disableSource: true,
            disableTarget: true,
        }
    })


    return {
        nodes,
        edges
    }
} 