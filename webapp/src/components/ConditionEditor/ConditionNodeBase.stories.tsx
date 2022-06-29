import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { useState } from "react";
import { AutomationCondition } from "types/automations/conditions";
import { ConditionNodeBase } from "./ConditionNodeBase";

export default {
  title: "ConditionEditor/NodeBase",
  component: ConditionNodeBase,
  parameters: { actions: { argTypesRegex: "^on.*" } },
} as ComponentMeta<typeof ConditionNodeBase>;

const Template: ComponentStory<typeof ConditionNodeBase> = ({
  condition,
  ...args
}) => {
  const [data, setData] = useState(condition);
  return (
    <Page>
      <ConditionNodeBase
        {...args}
        condition={data}
        onUpdate={(data) => {
          setData(data);
        }}
      />
    </Page>
  );
};

export const TemplateViewer = Template.bind({});
TemplateViewer.args = {
  condition: {
    condition: "template",
    value_template: "states('switch.light_kitchen') == 'on'",
  } as AutomationCondition,
};

export const MultipleThings = Template.bind({});
MultipleThings.args = {
  condition: {
    condition: "or",
    conditions: [
      {
        condition: "and",
        conditions: [
          {
            condition: "numeric_state",
            entity_id: ["sensor.kitchen_humidity"],
            above: "40",
          },
          {
            condition: "template",
            value_template: "states('switch.kitchen') == 'on'",
          },
        ],
      },
      {
        condition: "numeric_state",
        entity_id: ["sensor.kitchen_temperature"],
        above: "51",
      },
    ],
  } as AutomationCondition,
};
