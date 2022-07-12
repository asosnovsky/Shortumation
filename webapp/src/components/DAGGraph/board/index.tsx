import "./index.css";

import { FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  useViewport,
} from "react-flow-renderer";

import { NodeEditor } from "components/NodeEditor";
import { Modal } from "components/Modal";

import { nodeTypes } from "../nodes";
import { DAGGraphBoardProps } from "./types";

export const DAGGraphBoard: FC<DAGGraphBoardProps> = (props) => {
  return (
    <ReactFlowProvider>
      <DAGGraphBoardInner {...props} />
    </ReactFlowProvider>
  );
};

export const DAGGraphBoardInner: FC<DAGGraphBoardProps> = ({
  modalState,
  state,
  closeModal,
}) => {
  const { zoom } = useViewport();
  // render unready or errored states
  if (!state.ready) {
    return (
      <div className="dag-graphboard loading">
        <CircularProgress />
      </div>
    );
  }

  if ("error" in state.data) {
    return <div className="dag-graphboard errored">{state.data.error}</div>;
  }

  // modal
  let modalBody = <></>;
  if (modalState) {
    modalBody = (
      <NodeEditor
        node={modalState.node}
        onClose={closeModal}
        onSave={(n) => {
          modalState.update(n as any);
          closeModal();
        }}
        allowedTypes={modalState.allowedTypes}
        saveBtnCreateText={modalState.saveBtnCreateText}
      />
    );
  }
  // this hack avoids breakage on when zooming
  const prefix = Math.floor(zoom / (2.5 / 3));
  const elements = {
    nodes: state.data.elements.nodes.map((n) => ({
      ...n,
      id: `${prefix}-${n.id}`,
    })),
    edges: state.data.elements.edges.map((n) => ({
      ...n,
      id: `${prefix}-${n.id}`,
      source: `${prefix}-${n.source}`,
      target: `${prefix}-${n.target}`,
    })),
  };
  // main render
  return (
    <>
      <Modal open={!!modalState}>{modalBody}</Modal>
      <ReactFlow
        className="dag-graphboard"
        nodeTypes={nodeTypes}
        snapToGrid
        onlyRenderVisibleElements
        nodesConnectable={false}
        nodesDraggable={false}
        {...elements}
      >
        <Controls />
      </ReactFlow>
    </>
  );
};
