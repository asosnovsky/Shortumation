import { DAGBoard } from "components/DAGSvgs/DAGBoard";
import { FC, useState } from "react";
import { useTheme } from "styles/theme";
import { SequenceNodeProps, ModalState } from './types';
import Color from 'chroma-js';
import { computeNodesEdgesPos } from './positions';
import { Modal } from 'components/Modal';
import { NodeEditor } from 'components/NodeEditor';
import { MultiNodeEditor } from "components/MultiNodeEditors";
import { chain } from "utils/iter";

export const SequenceNodes: FC<SequenceNodeProps & { zoomLevel: number }> = (props) => {
  // state
  const theme = useTheme();
  const [modalState, setModalState] = useState<ModalState | null>(null);

  // modal
  let modalBody = <></>
  if (modalState) {
    if (modalState.single) {
      modalBody = <NodeEditor
        node={modalState.node}
        onClose={() => setModalState(null)}
        onSave={n => { modalState.update(n as any); setModalState(null) }}
        allowedTypes={modalState.onlyConditions ? ['condition'] : ['action', 'condition']}
        saveBtnCreateText={modalState.saveBtnCreateText}
      />
    } else {
      modalBody = <MultiNodeEditor
        sequence={modalState.node}
        onClose={() => setModalState(null)}
        onSave={(i, n) => {
          modalState.update([
            ...modalState.node.slice(0, i),
            n as any,
            ...modalState.node.slice(i + 1),
          ]); setModalState(null)
        }}
        onAdd={(n, slide) => {
          modalState.update([...modalState.node, n as any]);
          slide(modalState.node.length)
        }}
        onRemove={(i, slide) => {
          modalState.update([
            ...modalState.node.slice(0, i),
            ...modalState.node.slice(i + 1),
          ]);
          slide(modalState.node.length - 2);
        }}
        allowedTypes={modalState.onlyConditions ? ['condition'] : ['action', 'condition']}
      />
    }
  }

  // compute elemets
  let elmIter = computeNodesEdgesPos(
    props.startPoint,
    props.sequence,
    props.onChange,
    s => setModalState(s)
  );
  if (props.additionalElements) {
    elmIter = chain([elmIter, props.additionalElements()]);
  }

  // render
  return <>
    <DAGBoard
      zoomLevel={props.zoomLevel}
      elements={elmIter}
      settings={{
        ...props.dims,
        edgeNextColor: theme.secondaryAccent,
        edgeChildColor: Color(theme.secondaryAccent).set('rgb.b', 200).hex(),
      }}
      children={props.children}
    />
    <Modal open={!!modalState}>
      {modalBody}
    </Modal>
  </>
}
