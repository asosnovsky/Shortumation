import "./index.css";
import { FC, useEffect, useState } from 'react';
import { AutomationNode, AutomationNodeMapping } from 'types/automations';
import { NodeEditor } from 'components/NodeEditor';
import { Button } from 'components/Inputs/Button';
import { AutomationTriggerDevice } from 'types/automations/triggers';
import { useMultiNodeEditorState } from "./state";
import { MultiNodeEditorProps } from "./types";


export const MultiNodeEditor: FC<MultiNodeEditorProps> = props => {
  // state
  const state = useMultiNodeEditorState(props)
  // components
  const nextOrAddBtn = <Button
    onClick={state.moveForward}
  >
    {!state.isLast ? ">>" : "+"}
  </Button>;
  // branch
  if (state.isEmpty) {
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
        <Button onClick={state.onClose}>Close</Button>
      </div>
    </div>
  }
  return <div className={["multinode-editor", state.isModified ? "modded" : ''].join(' ')}>
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
