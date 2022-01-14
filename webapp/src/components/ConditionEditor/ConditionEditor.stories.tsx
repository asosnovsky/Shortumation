import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { ConditionEditor } from ".";
import { AutomationCondition } from 'types/automations/conditions';

export default {
  title: 'ConditionEditor',
  component: ConditionEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof ConditionEditor>;


export const Basic: ComponentStory<typeof ConditionEditor> = args => {
  const [state, setState] = useState<AutomationCondition>({
    "$smType": "condition",
    "condition": "or",
    "condition_data": {
      "conditions": [
        {
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
        },
        {
          "$smType": "condition",
          "condition": "numeric_state",
          "condition_data": {
            "entity_id": [
              "sensor.kitchen_temperature"
            ],
            "above": "51"
          }
        }
      ]
    }
  })
  return (
    <div className="page">
      <ConditionEditor
        onUpdate={setState}
        onDelete={() => { }}
        condition={state}
      />
    </div>
  )
}
