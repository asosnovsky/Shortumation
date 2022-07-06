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
import { Modal } from "components/Modal";
import { AutomationCondition } from "types/automations/conditions";
import { convertToFlowNode, makeOnEditAutomationConditions } from "./helpers";
import { DAGErrorNode } from "./DAGErrorNode";
import { useHA } from "haService";
import { getDescriptionFromAutomationNode } from "utils/formatting";
import { DagFlowUpdateBaseArgs, makeDagFlowUpdate } from "./DAGFlowUpdater";

const nodeTypes = {
  dagnode: convertToFlowNode(DAGNode),
  errornode: convertToFlowNode(DAGErrorNode),
  dagcircle: DAGCircle,
};

export type DAGAutomationFlowProps = DagFlowUpdateBaseArgs & {
  className?: string;
  dims: DAGAutomationFlowDims;
};

export const DAGAutomationFlow: FC<DAGAutomationFlowProps> = (props) => {
  // state
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const { namer } = useHA();
  const dagUpdater = makeDagFlowUpdate({
    ...props,
    openModal: setModalState,
  });
  // alias
  const { className, dims, sequence, condition, trigger } = props;
  // modal
  let modalBody = <></>;
  if (modalState) {
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
      onEditClick: dagUpdater.onEditAutomationConditions,
      onAddNode: () => dagUpdater.addNode(0, "sequence"),
    },
    dims
  );
  const flowData: FlowData = {
    nodes: [condPoint],
    edges: [],
  };
  triggerToFlow(
    flowData,
    trigger,
    condPoint.id,
    dims,
    dagUpdater.makeTriggerMakerOptions(namer)
  );
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
    dagUpdater.sequenceUpdater
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
