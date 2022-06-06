import { AutomationTrigger } from 'types/automations/triggers';
import { DAGAutomationFlowDims, FlowData, TriggerMakerOptions } from './types';
import { makeAddButton } from './flowDataMods';
import { getDescriptionFromAutomationNode } from 'utils/formatting';

export const triggerToFlow = (
    flowData: FlowData,
    trigger: AutomationTrigger[],
    toPoint: string,
    dims: DAGAutomationFlowDims,
    opts: TriggerMakerOptions,
) => {
    const {
        distanceFactor,
        nodeHeight,
        nodeWidth,
        padding,
        conditionHeight,
        conditionWidth,
        circleSize,
        flipped,
    } = dims;
    // convert all triggers to dag nodes
    trigger.forEach((t, i) => {
        const flowId = `t-${i}`;
        flowData.nodes.push({
            id: flowId,
            type: 'dagnode',
            data: {
                label: getDescriptionFromAutomationNode(t),
                height: nodeHeight,
                width: nodeWidth,
                flipped,
                color: 'red',
                onEditClick: () => opts.onEdit(i),
                onXClick: () => opts.onDelete(i),
            },
            position: flipped ? {
                y: padding.y,
                x: padding.x + nodeWidth * distanceFactor * i
            } : {
                x: padding.x,
                y: padding.y + nodeHeight * distanceFactor * i
            }
        })
        flowData.edges.push({
            id: `e(${flowId})-(${toPoint})`,
            source: flowId,
            target: toPoint,
        })
    });

    // create a 'add button'
    flowData.nodes.push(makeAddButton(
        'trigger-add',
        flipped ? {
            y: padding.y + circleSize / 4,
            x: padding.x + nodeWidth * distanceFactor * trigger.length,
        } : {
            x: padding.x + nodeWidth * 0.4,
            y: padding.y + conditionHeight / 2 + nodeHeight * distanceFactor * trigger.length,
        },
        dims,
        opts.onAdd
    ))
} 