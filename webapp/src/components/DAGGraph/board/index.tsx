import "./index.css";

import { FC, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ReactFlow, { Controls, useReactFlow } from "react-flow-renderer";

import { NodeEditor } from "components/NodeEditor";
import { Modal } from "components/Modal";

import { nodeTypes } from "../nodes";
import { DAGGraphBoardProps } from "./types";

export const DAGGraphBoard: FC<DAGGraphBoardProps> = ({
  modalState,
  state,
  closeModal,
  additionalControls,
}) => {
  const reactFlow = useReactFlow();
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

  // useEffect(() => {
  //   if (state.ready) {
  //     reactFlow.fitView();
  //   }
  // }, [state.ready, reactFlow]);

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
        <Controls showInteractive={false} showFitView={false}>
          {additionalControls}
        </Controls>
      </ReactFlow>
    </>
  );
};
