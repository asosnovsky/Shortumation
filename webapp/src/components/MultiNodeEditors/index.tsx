import "./index.css";
import { FC } from 'react';
import { NodeEditor } from 'components/NodeEditor';
import { Button } from 'components/Inputs/Button';
import { useMultiNodeEditorState } from "./state";
import { MultiNodeEditorProps } from "./types";
import useWindowSize from 'utils/useWindowSize';


export const MultiNodeEditor: FC<MultiNodeEditorProps> = props => {
  // state
  const state = useMultiNodeEditorState(props);
  const { isMobile } = useWindowSize();
  // components
  const nextOrAddBtn = <Button
    onClick={state.moveForward}
  >
    {!state.isLast ? ">>" : "+"}
  </Button>;
  // branch
  if (state.isEmpty) {
    return <div className={["multinode-editor", state.isModified ? "modded" : '', isMobile ? 'mobile' : ''].join(' ')} style={{
      minWidth: '20vw',
    }}>
      <div className="multinode-editor--navbar">
        {nextOrAddBtn}
      </div>
      <div className='node-editor--footer' style={{ marginTop: '1em' }}>
        <Button onClick={state.onClose}>Close</Button>
        <Button onClick={state.onSaveEmpty} className="node-editor--footer--save">Save</Button>
      </div>
      <div className='column center'>
        <span>{state.currentSlideNumber}/<u className="multinode-editor--total">{state.totalSlides}</u></span>
      </div>
    </div>
  }
  return <div className={["multinode-editor", state.isModified ? "modded" : '', isMobile ? 'mobile' : ''].join(' ')}>
    <div className="multinode-editor--navbar">
      <Button onClick={state.moveBack} disabled={state.currentSlideNumber === 0}>{"<<"}</Button>
      <Button onClick={state.onRemove}> Delete</Button>
      {nextOrAddBtn}
    </div>
    <NodeEditor
      key={state.currentSlideNumber}
      node={state.currentSlide}
      allowedTypes={props.allowedTypes}
      onClose={state.onClose}
      onSave={state.onSave}
      onFlags={state.updateInternalNode}
    />
    <div className='column center'>
      <span>{state.currentSlideNumber + 1}/<u className="multinode-editor--total">{state.totalSlides}</u></span>
    </div>
  </div>
}
