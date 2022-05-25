import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { ConditionEditor } from ".";
import { AutomationCondition } from 'types/automations/conditions';
import { Page } from "components/Page";

export default {
  title: 'ConditionEditor',
  component: ConditionEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof ConditionEditor>;


export const Basic: ComponentStory<typeof ConditionEditor> = args => {
  const [state, setState] = useState<AutomationCondition>({
    "condition": "or",
    "conditions": [
      {
        "condition": "and",
        "conditions": [
          {
            "condition": "numeric_state",
            "entity_id": [
              "sensor.kitchen_humidity"
            ],
            "above": "40"
          },
          {
            "condition": "template",
            "value_template": "states('switch.kitchen') == 'on'"
          }
        ]
      },
      {
        "condition": "numeric_state",
        "entity_id": [
          "sensor.kitchen_temperature"
        ],
        "above": "51"
      }
    ]
  })
  return (
    <Page>
      <ConditionEditor
        onUpdate={setState}
        onDelete={() => { }}
        condition={state}
      />
    </Page>
  )
}
