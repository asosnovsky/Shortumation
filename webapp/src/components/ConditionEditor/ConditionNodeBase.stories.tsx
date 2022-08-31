import { useState } from "react";
import { AutomationCondition } from "types/automations/conditions";
import { ConditionNodeBase } from "./ConditionNodeBase";

import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: ConditionNodeBase,
  meta: {
    title: "ConditionEditor/NodeBase",
  },
  BaseTemplate: ({ condition, ...args }) => {
    const [data, setData] = useState(condition);
    return (
      <ConditionNodeBase
        {...args}
        condition={data}
        onUpdate={(data) => {
          setData(data);
        }}
      />
    );
  },
});

export default componentMeta;

export const TemplateViewer = make({
  condition: {
    condition: "template",
    value_template: "states('switch.light_kitchen') == 'on'",
  } as AutomationCondition,
});

export const MultipleThings = make({
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
});
