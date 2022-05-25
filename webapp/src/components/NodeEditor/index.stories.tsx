import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NodeEditor } from ".";

import { AutomationCondition } from "types/automations/conditions";
import { Button } from "components/Inputs/Button";
import { useState } from 'react';
import { Modal } from "components/Modal";
import { Page } from "components/Page";


export default {
  title: 'NodeEditor',
  component: NodeEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    node: {
      'data': {},
      'service': '',
      'target': '',
    }
  }
} as ComponentMeta<typeof NodeEditor>

const Base: ComponentStory<typeof NodeEditor> = props => {

  return <Page>
    <NodeEditor {...props} />
  </Page>
};
export const Action = Base.bind({})
export const SingleOption = Action.bind({})
SingleOption.args = {
  ...SingleOption.args,
  allowedTypes: ['action'],
}
export const Condition = Action.bind({})
Condition.args = {
  ...Condition.args,
  node: {
    "condition": "and",
    "conditions": [
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
  } as AutomationCondition,
}


export const InAModal: ComponentStory<typeof NodeEditor> = props => {

  const [open, setOpen] = useState(false);
  return <Page>
    <Button onClick={() => setOpen(!open)}>Open Editor</Button>
    <Modal open={open}>
      <NodeEditor {...props} onClose={() => setOpen(!open)} />
    </Modal>
  </Page>
};
