import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NodeEditor } from ".";
import { usePageTheme } from "styles/page";
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
  const { classes } = usePageTheme({});
  return <div className={classes.page}>
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
    "$smType": "condition",
    "condition": "and",
    "condition_data": {
      "conditions": [
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
  } as AutomationCondition,
}


export const InAModal: ComponentStory<typeof NodeEditor> = props => {
  const { classes } = usePageTheme({});
  const [open, setOpen] = useState(false);
  return <div className={classes.page}>
    <Button onClick={() => setOpen(!open)}>Open Editor</Button>
    <Modal open={open}>
      <NodeEditor {...props} onClose={() => setOpen(!open)} />
    </Modal>
  </div>
};
