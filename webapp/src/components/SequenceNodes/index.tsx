import { DAGBoard } from "components/DAGSvgs/DAGBoard";
import { FC, useState } from "react";
import { useTheme } from "styles/theme";
import { SequenceNodeProps, ModalState } from './types';
import Color from 'chroma-js';
import { computeNodesEdgesPos } from './positions';
import { Modal } from 'components/Modal';
import { NodeEditor } from 'components/NodeEditor';
import { MultiNodeEditor } from "components/MultiNodeEditors";

export const SequenceNodes: FC<SequenceNodeProps & { zoomLevel: number }> = (props) => {
  const theme = useTheme();
  const [modalState, setModalState] = useState<ModalState | null>(null);
  let modalBody = <></>
  if (modalState) {
    if (modalState.single) {
      modalBody = <NodeEditor
        node={modalState.node}
        onClose={() => setModalState(null)}
        onSave={n => { modalState.update(n as any); setModalState(null) }}
        allowedTypes={modalState.onlyConditions ? ['condition'] : ['action', 'condition']}
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

  return <>
    <DAGBoard
      zoomLevel={props.zoomLevel}
      elements={computeNodesEdgesPos(
        props.startPoint,
        props.sequence,
        props.onChange,
        s => setModalState(s)
      )}
      settings={{
        ...props.dims,
        edgeNextColor: theme.secondaryAccent,
        edgeChildColor: Color(theme.secondaryAccent).set('rgb.b', 200).hex(),
      }}
    />
    <Modal open={!!modalState}>
      {modalBody}
    </Modal>
  </>
}
