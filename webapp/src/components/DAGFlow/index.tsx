import { FC } from "react";

import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { AutomationData } from "types/automations";
import { triggerToFlow } from "./triggerConvertor";
import { DAGNode } from "./DAGNode";
import { DAGFlowDims, TriggerMakerOptions } from "./types";
import { DAGCircle } from './DAGCircle';

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
    const {
        nodes,
        edges,
    } = triggerToFlow(automation.trigger, dims, opts.triggers);
    return (
        <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            snapToGrid
            onlyRenderVisibleElements
            nodesConnectable={false}
            nodesDraggable={false}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    );
}