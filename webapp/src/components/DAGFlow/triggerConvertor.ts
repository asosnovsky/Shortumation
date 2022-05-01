import { AutomationTrigger } from 'types/automations/triggers';
import { DAGFlowDims, FlowData, TriggerMakerOptions } from './types';


export const triggerToFlow = (
    flowData: FlowData,
    trigger: AutomationTrigger[],
    toPoint: string,
    {
        distanceFactor,
        nodeHeight,
        nodeWidth,
        circleSize,
        padding,
    }: DAGFlowDims,
    opts: TriggerMakerOptions,
) => {
    // convert all triggers to dag nodes
    trigger.forEach((t, i) => {
        const flowId = `t-${i}`;
        flowData.nodes.push({
            id: flowId,
            type: 'dagnode',
            data: {
                label: t.alias ?? t.platform,
                height: nodeHeight,
                width: nodeWidth,
                color: 'red',
                onEdit: () => opts.onEdit(i),
                onXClick: () => opts.onDelete(i),
            },
            position: { x: padding.x, y: padding.y + nodeHeight * distanceFactor * i }
        })
        flowData.edges.push({
            id: `e(${flowId})-(${toPoint})`,
            source: flowId,
            target: toPoint,
        })
    });

    // create a 'add button'
    flowData.nodes.push({
        id: `trigger-add`,
        type: 'dagcircle',
        position: {
            x: padding.x + nodeWidth * 0.4,
            y: padding.y + nodeHeight * distanceFactor * trigger.length,
        },
        data: {
            size: circleSize,
            backgroundColor: 'green',
            onAdd: opts.onAdd,
            disableSource: true,
            disableTarget: true,
        }
    })
} 