import { FC, useState } from "react";

import ReactFlow, { Controls } from "react-flow-renderer";
import { AutomationSequenceNode } from "types/automations";
import { AutomationTrigger } from "types/automations/triggers";
import { triggerToFlow } from "./triggerConvertor";
import { DAGNode, makeConditionPoint } from "./DAGNode";
import {
  DAGAutomationFlowDims,
  FlowData,
  ModalState,
  UpdateModalState,
} from "./types";
import { DAGCircle } from "./DAGCircle";
import { sequenceToFlow } from "./sequenceConvertor";
import { makeSequenceUpdater } from "./updater";
import { NodeEditor } from "components/NodeEditor";
import { MultiNodeEditor } from "components/MultiNodeEditors";
import { Modal } from "components/Modal";
import { AutomationCondition } from "types/automations/conditions";
import { convertToFlowNode, makeOnEditAutomationConditions } from "./helpers";
import { DAGErrorNode } from "./DAGErrorNode";
import { useHA } from "haService";
import { getDescriptionFromAutomationNode } from "utils/formatting";

const nodeTypes = {
  dagnode: convertToFlowNode(DAGNode),
  errornode: convertToFlowNode(DAGErrorNode),
  dagcircle: DAGCircle,
};

export interface DAGAutomationFlowProps {
  className?: string;
  trigger: AutomationTrigger[];
  condition: AutomationCondition[];
  sequence: AutomationSequenceNode[];
  dims: DAGAutomationFlowDims;
  onTriggerUpdate: (t: AutomationTrigger[]) => void;
  onSequenceUpdate: (s: AutomationSequenceNode[]) => void;
  onConditionUpdate: (s: AutomationCondition[]) => void;
}

export const DAGAutomationFlow: FC<DAGAutomationFlowProps> = ({
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
  const { namer } = useHA();
  // modal
  let modalBody = <></>;
  if (modalState) {
    if (modalState.single) {
      modalBody = (
        <NodeEditor
          node={modalState.node}
          isErrored={modalState.isError}
          onClose={() => setModalState(null)}
          onSave={(n) => {
            modalState.update(n as any);
            setModalState(null);
          }}
          allowedTypes={modalState.allowedTypes}
          saveBtnCreateText={modalState.saveBtnCreateText}
        />
      );
    } else {
      modalBody = (
        <MultiNodeEditor
          sequence={modalState.node}
          onClose={() => setModalState(null)}
          onSave={(n) => modalState.update(n as any)}
          allowedTypes={["condition"]}
        />
      );
    }
  }

  // convert automation to flow data
  const condPoint = makeConditionPoint(
    "c",
    dims.flipped
      ? {
          y: dims.padding.y + dims.nodeHeight * dims.distanceFactor,
          x: dims.padding.x + (dims.nodeWidth - dims.conditionWidth) / 2,
        }
      : {
          x: dims.padding.x + dims.nodeWidth * dims.distanceFactor,
          y: dims.padding.y + (dims.nodeHeight - dims.conditionHeight) / 2,
        },
    {
      label: getDescriptionFromAutomationNode(
        {
          condition: "and",
          conditions: condition,
        },
        namer,
        true
      ),
      onEditClick: makeOnEditAutomationConditions(
        condition,
        onConditionUpdate,
        setModalState
      ),
    },
    dims
  );
  const flowData: FlowData = {
    nodes: [condPoint],
    edges: [],
  };
  triggerToFlow(flowData, trigger, condPoint.id, dims, {
    namer,
    onAdd: () =>
      setModalState({
        single: true,
        saveBtnCreateText: true,
        node: {
          platform: "device",
        },
        update: (n) => {
          onTriggerUpdate([...trigger, n]);
        },
        allowedTypes: ["trigger"],
      }),
    onDelete: (i) =>
      onTriggerUpdate([...trigger.slice(0, i), ...trigger.slice(i + 1)]),
    onEdit: (i) =>
      setModalState({
        single: true,
        node: trigger[i],
        update: (t) =>
          onTriggerUpdate([...trigger.slice(0, i), t, ...trigger.slice(i + 1)]),
        allowedTypes: ["trigger"],
      }),
  });
  sequenceToFlow(
    flowData,
    sequence,
    condPoint.id,
    {
      ...dims,
      padding: dims.flipped
        ? {
            y: condPoint.position.y - dims.nodeHeight,
            x: dims.padding.x,
          }
        : {
            x: condPoint.position.x - dims.nodeWidth,
            y: dims.padding.y,
          },
    },
    namer,
    makeSequenceUpdater(sequence, onSequenceUpdate, setModalState)
  );
  // this fixes some strange edge drawing issue
  flowData.edges = flowData.edges.map((e) => ({
    ...e,
    source: `${e.source}-${dims.flipped}`,
    target: `${e.target}-${dims.flipped}`,
  }));
  flowData.nodes = flowData.nodes.map((n) => ({
    ...n,
    id: `${n.id}-${dims.flipped}`,
  }));
  // render
  return (
    <>
      <Modal open={!!modalState}>{modalBody}</Modal>
      <ReactFlow
        className={className}
        nodeTypes={nodeTypes}
        snapToGrid
        onlyRenderVisibleElements
        nodesConnectable={false}
        nodesDraggable={false}
        {...flowData}
      >
        <Controls />
      </ReactFlow>
    </>
  );
};
