import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NodeEditor } from ".";
import { usePageTheme } from "styles/page";
import { AutomationCondition } from "types/automations/conditions";


export default {
  title: 'NodeEditor',
  component: NodeEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {}
} as ComponentMeta<typeof NodeEditor>

const Base: ComponentStory<typeof NodeEditor> = props => {
  const { classes } = usePageTheme({});
  return <div className={classes.page}>
    <NodeEditor {...props} />
  </div>
};
export const Action = Base.bind({})
Action.args = {
  ...Action.args,
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
export const SingleOption = Action.bind({})
SingleOption.args = {
  ...Action.args,
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
