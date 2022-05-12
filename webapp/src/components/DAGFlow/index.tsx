import { FC, useState } from "react";

import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { AutomationSequenceNode } from "types/automations";
import { AutomationTrigger } from 'types/automations/triggers';
import { triggerToFlow } from "./triggerConvertor";
import { DAGNode } from "./DAGNode";
import { DAGAutomationFlowDims, FlowData, ModalState, UpdateModalState } from './types';
import { DAGCircle } from './DAGCircle';
import { sequenceToFlow } from "./sequenceConvertor";
import { makeSequenceUpdater } from "./updater";
import { NodeEditor } from "components/NodeEditor";
import { MultiNodeEditor } from "components/MultiNodeEditors";
import { Modal } from "components/Modal";
import { AutomationCondition } from "types/automations/conditions";
import { makeConditionPoint } from "./flowDataMods";

const nodeTypes = {
    'dagnode': DAGNode,
    'dagcircle': DAGCircle,
}

interface Props {
    className?: string;
    trigger: AutomationTrigger[];
    condition: AutomationCondition[];
    sequence: AutomationSequenceNode[];
    dims: DAGAutomationFlowDims;
    onTriggerUpdate: (t: AutomationTrigger[]) => void;
    onSequenceUpdate: (s: AutomationSequenceNode[]) => void;
    onConditionUpdate: (s: AutomationCondition[]) => void;
}

export const DAGAutomationFlow: FC<Props> = ({
    className,
    trigger,
    condition,
    sequence,
    onTriggerUpdate,
    onSequenceUpdate,
    onConditionUpdate,
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
                onSave={(n) => modalState.update(n as any)}
                allowedTypes={['condition']}
            />
        }
    }

    // convert automation to flow data
    const condPoint = makeConditionPoint('c', {
        x: dims.padding.x + dims.nodeWidth * dims.distanceFactor,
        y: dims.padding.y + dims.nodeHeight * 0.25
    }, dims, condition.length, makeOnEditAutomationConditions(
        condition,
        onConditionUpdate,
        setModalState,
    ));
    const flowData: FlowData = {
        nodes: [condPoint],
        edges: [],
    }
    triggerToFlow(flowData, trigger, condPoint.id, dims, {
        onAdd: () => onTriggerUpdate([
            ...trigger, {
                platform: 'event',
                event_type: '',
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
        {
            ...dims, padding: {
                x: condPoint.position.x - dims.nodeWidth - dims.conditionWidth,
                y: dims.padding.y,
            }
        },
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

const makeOnEditAutomationConditions = (
    conditions: AutomationCondition[],
    updateConditions: (c: AutomationCondition[]) => void,
    openModal: UpdateModalState,
) => () => openModal({
    single: false,
    node: conditions,
    allowedTypes: ['condition'],
    update: c => updateConditions(c as any),
})