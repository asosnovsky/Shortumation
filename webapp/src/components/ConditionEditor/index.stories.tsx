import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";
import { AutomationCondition } from "types/automations/conditions";

import { ConditionEditor } from ".";

export default {
  title: 'ConditionEditor',
  component: ConditionEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
} as ComponentMeta<typeof ConditionEditor>;


const Template: ComponentStory<typeof ConditionEditor> = ({ condition, ...args }) => {

  const [data, setData] = useState(condition);
  return <Page>
    <ConditionEditor {...args}
      condition={data}
      onUpdate={data => {
        setData(data)
      }}
    />
  </Page>
}

export const TemplateViewer = Template.bind({})
TemplateViewer.args = {
  condition: {
    condition: 'template',
    value_template: "states('switch.light_kitchen') == 'on'"
  } as AutomationCondition,
}


export const NumericStateViewer = Template.bind({})
NumericStateViewer.args = {
  condition: {
    condition: "numeric_state",
    entity_id: "sensor.humidity_kitchen",
    above: "10",
  } as AutomationCondition,
}

export const LogicCondition = Template.bind({})
LogicCondition.args = {
  condition: {
    condition: 'or',
    conditions: [
      {
        condition: 'numeric_state',
        entity_id: 'sensor.humidity_kitchen',
        above: '60'
      },
      {
        condition: 'numeric_state',
        entity_id: 'sensor.humidity_living_room',
        above: '60'
      },
      {
        condition: 'and',
        conditions: [
          {
            condition: 'numeric_state',
            entity_id: 'sensor.humidity_bedroom',
            above: '60'
          },
          {
            condition: 'numeric_state',
            entity_id: 'sensor.humidity_bathroom',
            above: '60'
          }
        ]
      },
    ]
  } as AutomationCondition,
}
