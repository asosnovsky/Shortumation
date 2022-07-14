import "./index.css";

import { FC, useRef } from "react";
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
  const lastZoom = useRef(zoom);
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
  // const prefix = Date.now();
  const elements = {
    nodes: state.data.elements.nodes,
    edges: state.data.elements.edges,
  };
  // main render
  return (
    <>
      <Modal open={!!modalState}>{modalBody}</Modal>
      <ReactFlow
        className="dag-graphboard"
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.25}
        nodesConnectable={false}
        nodesDraggable={false}
        {...elements}
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </>
  );
};
