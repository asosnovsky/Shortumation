import { FC, useState } from "react";

import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { AutomationSequenceNode } from "types/automations";
import { AutomationTrigger } from 'types/automations/triggers';
import { triggerToFlow } from "./triggerConvertor";
import { DAGNode } from "./DAGNode";
import { DAGAutomationFlowDims, TriggerMakerOptions, FlowData, ModalState } from './types';
import { DAGCircle } from './DAGCircle';
import { sequenceToFlow } from "./sequenceConvertor";
import { makeSequenceUpdater } from "./updater";
import { NodeEditor } from "components/NodeEditor";
import { MultiNodeEditor } from "components/MultiNodeEditors";
import { Modal } from "components/Modal";

const nodeTypes = {
    'dagnode': DAGNode,
    'dagcircle': DAGCircle,
}

interface Props {
    className?: string;
    sequence: AutomationSequenceNode[];
    trigger: AutomationTrigger[];
    dims: DAGAutomationFlowDims;
    onTriggerUpdate: (t: AutomationTrigger[]) => void;
    onSequenceUpdate: (s: AutomationSequenceNode[]) => void;
}

export const DAGAutomationFlow: FC<Props> = ({
    className,
    sequence,
    trigger,
    onTriggerUpdate,
    onSequenceUpdate,
    dims,
}) => {
    // state
    const [modalState, setModalState] = useState<ModalState | null>(null);

    // modal
    let modalBody = <></>
    if (modalState) {
        if (modalState.single) {
            modalBody = <NodeEditor
                node={modalState.node}
                onClose={() => setModalState(null)}
                onSave={n => { modalState.update(n as any); setModalState(null); }}
                allowedTypes={modalState.allowedTypes}
                saveBtnCreateText={modalState.saveBtnCreateText}
            />
        } else {
            modalBody = <MultiNodeEditor
                sequence={modalState.node}
                onClose={() => setModalState(null)}
                onSave={(n) => {
                    modalState.update(n as any);
                    setModalState(null);
                }}
                allowedTypes={['condition']}
            />
        }
    }

    // convert automation to flow data
    const condPoint = makeConditionPoint(dims);
    const flowData: FlowData = {
        nodes: [condPoint],
        edges: [],
    }
    triggerToFlow(flowData, trigger, condPoint.id, dims, {
        onAdd: () => onTriggerUpdate([
            ...trigger, {
                platform: 'event',
                $smType: 'trigger',
                event_type: 'test',
            }
        ]),
        onDelete: i => onTriggerUpdate([
            ...trigger.slice(0, i),
            ...trigger.slice(i + 1)
        ]),
        onEdit: i => setModalState({
            single: true,
            node: trigger[i],
            update: t => onTriggerUpdate([
                ...trigger.slice(0, i),
                t,
                ...trigger.slice(i + 1)
            ]),
            allowedTypes: ['trigger'],
        })
    });
    sequenceToFlow(
        flowData,
        sequence,
        condPoint.id,
        dims,
        makeSequenceUpdater(sequence, onSequenceUpdate, setModalState),
    );

    // render
    return <>
        <Modal open={!!modalState}>
            {modalBody}
        </Modal>
        <ReactFlow
            className={className}
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
    </>;
}


const makeConditionPoint = ({
    padding,
    nodeWidth,
    nodeHeight,
    circleSize,
}: DAGAutomationFlowDims) => ({
    id: `c`,
    type: 'dagcircle',
    position: { x: padding.x + nodeWidth * 2, y: padding.y + nodeHeight * 0.25 },
    data: {
        size: circleSize,
        backgroundColor: 'blue',
    }
})