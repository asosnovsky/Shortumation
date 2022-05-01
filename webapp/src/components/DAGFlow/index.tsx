import { FC } from "react";

import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { AutomationData } from "types/automations";
import { triggerToFlow } from "./triggerConvertor";
import { DAGNode } from "./DAGNode";
import { DAGFlowDims, TriggerMakerOptions, FlowData } from './types';
import { DAGCircle } from './DAGCircle';
import { sequenceToFlow } from "./sequenceConvertor";

const nodeTypes = {
    'dagnode': DAGNode,
    'dagcircle': DAGCircle,
}

interface Props {
    automation: AutomationData;
    dims: DAGFlowDims;
    opts: {
        triggers: TriggerMakerOptions;
    }
}

export const DAGFlow: FC<Props> = ({
    automation,
    opts,
    dims,
}) => {
    const condPoint = makeConditionPoint(dims);
    const flowData: FlowData = {
        nodes: [condPoint],
        edges: [],
    }
    triggerToFlow(flowData, automation.trigger, condPoint.id, dims, opts.triggers);
    sequenceToFlow(flowData, automation.sequence, condPoint.id, dims);
    return (
        <ReactFlow
            nodeTypes={nodeTypes}
            snapToGrid
            onlyRenderVisibleElements
            nodesConnectable={false}
            nodesDraggable={false}
            {...flowData}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    );
}


const makeConditionPoint = ({
    padding,
    nodeWidth,
    nodeHeight,
    circleSize,
}: DAGFlowDims) => ({
    id: `c`,
    type: 'dagcircle',
    position: { x: padding.x + nodeWidth * 2, y: padding.y + nodeHeight * 0.25 },
    data: {
        size: circleSize,
        backgroundColor: 'blue',
    }
})