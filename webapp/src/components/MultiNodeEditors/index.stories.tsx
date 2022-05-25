import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MultiNodeEditor } from ".";
import { Button } from "components/Inputs/Button";
import { Modal } from "components/Modal";
import { Page } from "components/Page";


export default {
  title: 'MultiNodeEditor',
  component: MultiNodeEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    allowedTypes: ['action', 'condition', 'trigger'],
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
  const [state, setState] = useState(args.sequence);

  return <Page>
    <div className="center column" style={{ paddingTop: "1em" }}>
      <MultiNodeEditor {...args} sequence={state} onSave={s => {
        args.onSave && args.onSave(s)
        setState(s)
      }} />
    </div>
  </Page>
}
export const InAModal: ComponentStory<typeof MultiNodeEditor> = props => {

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(props.sequence);
  return <Page>
    <Button onClick={() => setOpen(!open)}>Open Editor</Button>
    <Modal open={open}>
      <MultiNodeEditor
        {...props}
        sequence={state}
        onClose={() => setOpen(!open)}
        onSave={s => {
          props.onSave && props.onSave(s)
          setState(s)
        }}
      />
    </Modal>
  </Page>
};


export const EmptyConditionEditor = Simple.bind({})
EmptyConditionEditor.args = {
  ...EmptyConditionEditor.args,
  allowedTypes: ['condition'],
  sequence: [],
}