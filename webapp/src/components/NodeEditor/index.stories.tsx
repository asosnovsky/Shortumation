import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NodeEditor } from ".";

import { AutomationCondition } from "types/automations/conditions";
import { Button } from "components/Inputs/Button";
import { useState } from 'react';
import { Modal } from "components/Modal";


export default {
  title: 'NodeEditor',
  component: NodeEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    node: {
      $smType: 'action',
      action: 'service',
      action_data: {
        'data': {},
        'service': '',
        'target': '',
      }
    }
  }
} as ComponentMeta<typeof NodeEditor>

const Base: ComponentStory<typeof NodeEditor> = props => {

  return <div className="page">
    <NodeEditor {...props} />
  </div>
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
  return <div className="page">
    <Button onClick={() => setOpen(!open)}>Open Editor</Button>
    <Modal open={open}>
      <NodeEditor {...props} onClose={() => setOpen(!open)} />
    </Modal>
  </div>
};
