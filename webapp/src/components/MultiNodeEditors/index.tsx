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

export interface Props {
  sequence: AutomationNode[];
  allowedTypes?: Array<keyof AutomationNodeMapping>;
  onAdd?: (n: AutomationNode, slide: (i: number) => void) => void;
  onClose?: () => void;
  onSave?: (i: number, n: AutomationNode) => void;
  onRemove?: (i: number, slide: (i: number) => void) => void;
}

export const MultiNodeEditor: FC<Props> = ({
  sequence,
  allowedTypes = ['action', 'condition'],
  onClose,
  onAdd = () => { },
  onSave = () => { },
  onRemove = () => { },
}) => {
  const [slide, setSlide] = useState(0);
  // components
  const nextOrAddBtn = <Button
    onClick={() => {
      if (slide >= sequence.length - 1) {
        onAdd(makeDefault(allowedTypes[0]), setSlide)
      } else {
        setSlide(slide + 1)
      }
    }}
  >
    {(slide < sequence.length - 1) ? ">>" : "+"}
  </Button>;
  // branch
  if (sequence.length === 0) {
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        {nextOrAddBtn}
      </div>
      <Button onClick={onClose}>Close</Button>
    </div>
  }
  return <>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Button onClick={() => setSlide(slide - 1)} disabled={slide === 0}>{"<<"}</Button>
      <span>{slide + 1}/{sequence.length}</span>
      <Button
        onClick={() => onRemove(slide, setSlide)}
      >
        Delete
      </Button>
      {nextOrAddBtn}
    </div>
    <NodeEditor
      key={slide}
      node={sequence[slide]}
      allowedTypes={allowedTypes}
      onClose={onClose}
      onSave={n => onSave(slide, n)}
    />
  </>
}
