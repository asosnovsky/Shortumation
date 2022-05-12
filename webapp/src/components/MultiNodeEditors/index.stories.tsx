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
        "condition": "numeric_state",
        "entity_id": [
          "sensor.kitchen_humidity"
        ],
        "conditions": [],
        "above": "40"
      },
      {
        "condition": "template",
        "value_template": "states('switch.kitchen') == 'on'"
      }
    ]
  }
} as ComponentMeta<typeof MultiNodeEditor>

export const Simple: ComponentStory<typeof MultiNodeEditor> = args => {

  return <div className="page">
    <div className="center column" style={{ paddingTop: "1em" }}>
      <MultiNodeEditor {...args} />
    </div>
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
        onSave={setState}
      />
    </Modal>
  </div>
};
