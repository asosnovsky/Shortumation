import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MultiNodeEditor } from ".";
import { Button } from "components/Inputs/Button";
import { Modal } from "components/Modal";


export default {
  title: 'MultiNodeEditor',
  component: MultiNodeEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    sequence: [
      {
        "$smType": "condition",
        "condition": "numeric_state",
        "condition_data": {
          "entity_id": [
            "sensor.kitchen_humidity"
          ],
          "conditions": [],
          "above": "40"
        }
      },
      {
        "$smType": "condition",
        "condition": "template",
        "condition_data": {
          "value_template": "states('switch.kitchen') == 'on'"
        }
      }
    ]
  }
} as ComponentMeta<typeof MultiNodeEditor>

export const Simple: ComponentStory<typeof MultiNodeEditor> = args => {

  return <div className="page">
    <MultiNodeEditor {...args} />
  </div>
}
export const InAModal: ComponentStory<typeof MultiNodeEditor> = props => {

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(props.sequence);
  return <div className="page">
    <Button onClick={() => setOpen(!open)}>Open Editor</Button>
    <Modal open={open}>
      <MultiNodeEditor
        {...props}
        sequence={state}
        onClose={() => setOpen(!open)}
        onAdd={(n, slide) => { setState([...state, n]); slide(state.length) }}
        onRemove={(n, slide) => {
          setState([
            ...state.slice(0, n),
            ...state.slice(n + 1)
          ]);
          slide(state.length - 2)
        }}
      />
    </Modal>
  </div>
};
