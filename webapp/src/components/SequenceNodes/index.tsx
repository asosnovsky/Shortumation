import { DAGBoard } from "components/DAGSvgs/DAGBoard";
import { FC, useState } from "react";
import { AutomationSequenceNode } from 'types/automations';
import { useTheme } from "styles/theme";
import { SequenceNodeProps } from './types';
import Color from 'chroma-js';
import { computeNodesEdgesPos } from './positions';
import { Modal } from 'components/Modal';
import { NodeEditor } from 'components/NodeEditor';

interface ModalState {
  node: AutomationSequenceNode;
  update: (n: AutomationSequenceNode) => void;
  onlyConditions: boolean;
}

export const SequenceNodes: FC<SequenceNodeProps & { zoomLevel: number }> = (props) => {
  const theme = useTheme();
  const [modalState, setModalState] = useState<ModalState | null>(null);
  console.log({ modalState });
  return <>
    <DAGBoard
      zoomLevel={props.zoomLevel}
      elements={computeNodesEdgesPos(
        props.startPoint,
        props.sequence,
        props.onChange,
        (node, update, onlyConditions) => setModalState({
          node, update, onlyConditions,
        })
      )}
      settings={{
        ...props.dims,
        edgeNextColor: theme.secondaryAccent,
        edgeChildColor: Color(theme.secondaryAccent).set('rgb.b', 200).hex(),
      }}
    />
    <Modal open={!!modalState}>
      {modalState && <NodeEditor
        node={modalState.node}
        onClose={() => setModalState(null)}
        onSave={n => { modalState.update(n as any); setModalState(null) }}
        allowedTypes={modalState.onlyConditions ? ['condition'] : ['action', 'condition']}
      />}
    </Modal>
  </>
}
