import { FC, useState } from 'react';
import { AutomationNode, AutomationNodeMapping } from 'types/automations';
import { NodeEditor } from 'components/NodeEditor';
import { Button } from 'components/Inputs/Button';
import { AutomationTriggerDevice } from 'types/automations/triggers';


const makeDefault = (nodeType: keyof AutomationNodeMapping): AutomationNode => {
  switch (nodeType) {
    case 'action':
      return {
        $smType: 'action',
        action: "service",
        action_data: {
          'data': {},
          'service': '',
          'target': {},
        }
      }
    case 'condition':
      return {
        $smType: 'condition',
        condition: 'and',
        condition_data: {
          conditions: []
        }
      }
    default:
      return {
        platform: 'device',
        device_id: '',
        domain: '',
        type: '',
        subtype: '',
      } as AutomationTriggerDevice
  }
}

export interface MultiNodeEditorProps {
  sequence: AutomationNode[];
  allowedTypes?: Array<keyof AutomationNodeMapping>;
  onClose?: () => void;
  onSave?: (n: AutomationNode[]) => void;
}

export const MultiNodeEditor: FC<MultiNodeEditorProps> = ({
  sequence: initialState,
  allowedTypes = ['action', 'condition'],
  onClose = () => { },
  onSave = () => { },
}) => {
  // state
  const [{ slide, state, isNodeModified, isModified, isReady }, setState] = useState({
    slide: 0,
    state: initialState,
    isModified: false,
    isNodeModified: false,
    isReady: true,
  })
  // alias
  const areYouSureItsModified = () => isNodeModified ?
    window.confirm("You've made changes, by pressing this you will lose them!") :
    true
  const areYouSureItsNotReady = () => !isReady ?
    window.confirm("The node is not ready, are you sure you want to move?") :
    true
  const onAdd = () => setState({
    slide: state.length,
    state: [...state, makeDefault(allowedTypes[0])],
    isNodeModified: false,
    isReady,
    isModified: true,
  });
  const onRemove = () => setState({
    slide: slide > 0 ? slide - 1 : 0,
    state: [...state.slice(0, slide), ...state.slice(slide + 1)],
    isNodeModified: false,
    isReady,
    isModified: true,
  });
  const onNodeSave = (n: AutomationNode) => setState({
    slide,
    state: [...state.slice(0, slide), n, ...state.slice(slide + 1)],
    isNodeModified: false,
    isReady,
    isModified: true,
  });
  const onSaveAll = () => isNodeModified ?
    window.alert("Please save the node data first!") :
    onSave(state)
  const onNextOrAdd = () => {
    if (!areYouSureItsModified()) {
      return
    }
    if (!areYouSureItsNotReady()) {
      return
    }
    if (slide >= state.length - 1) {
      onAdd()
    } else {
      setState({ slide: slide + 1, state, isNodeModified, isReady, isModified, })
    }
  }
  const onBack = () => areYouSureItsModified() &&
    areYouSureItsNotReady() &&
    setState({ slide: slide - 1, state, isNodeModified, isReady, isModified, })
  // components
  const nextOrAddBtn = <Button
    onClick={onNextOrAdd}
  >
    {(slide < state.length - 1) ? ">>" : "+"}
  </Button>;
  // branch
  if (state.length === 0) {
    return <div className='column center' style={{
      minWidth: '20vw',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        {nextOrAddBtn}
      </div>
      <div className='column center' style={{ marginTop: '1em' }}>
        <Button onClick={() => areYouSureItsModified() && onClose()}>Close</Button>
      </div>
    </div>
  }
  return <>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      minWidth: '20vw',
    }}>
      <Button onClick={onBack} disabled={slide === 0}>{"<<"}</Button>
      <Button
        onClick={onRemove}
      >
        Delete
      </Button>
      {nextOrAddBtn}
    </div>
    <NodeEditor
      key={slide}
      node={state[slide]}
      allowedTypes={allowedTypes}
      onClose={onClose}
      onSave={onNodeSave}
      onFlags={
        (ir, inm) => ((inm !== isNodeModified) || (ir !== isReady)) &&
          setState({ slide, state, isNodeModified: inm, isReady: ir, isModified })
      }
    >
      <Button onClick={onSaveAll} style={{
        borderColor: isModified ? "var(--change)" : undefined,
        color: isModified ? "var(--change)" : undefined,
      }}>Save All</Button>
    </NodeEditor>
    <div className='column center'>
      <span>{slide + 1}/{state.length}</span>
    </div>
  </>
}
