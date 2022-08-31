import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MockPage, Page } from "components/Page";
import { useState } from "react";
import { AutomationCondition } from "types/automations/conditions";

import { ConditionEditor } from ".";
import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: ConditionEditor,
  meta: {
    title: "ConditionEditor",
    args: {
      initialViewMode: "edit",
    },
  },
  BaseTemplate: ({ condition, ...args }) => {
    const [data, setData] = useState(condition);
    return (
      <ConditionEditor
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

export const NumericStateViewer = make({
  condition: {
    condition: "numeric_state",
    entity_id: "sensor.humidity_kitchen",
    above: "10",
  } as AutomationCondition,
});

export const LogicCondition = make({
  condition: {
    condition: "or",
    conditions: [
      {
        condition: "numeric_state",
        entity_id: "sensor.humidity_kitchen",
        above: "60",
      },
      {
        condition: "numeric_state",
        entity_id: "sensor.humidity_living_room",
        above: "60",
      },
      {
        condition: "and",
        conditions: [
          {
            condition: "numeric_state",
            entity_id: "sensor.humidity_bedroom",
            above: "60",
          },
          {
            condition: "numeric_state",
            entity_id: "sensor.humidity_bathroom",
            above: "60",
          },
        ],
      },
    ],
  } as AutomationCondition,
});
export const TimeCondition = make({
  condition: {
    condition: "or",
    conditions: [
      {
        condition: "time",
      },
      {
        condition: "time",
        after: "10:00:00",
      },
      {
        condition: "time",
        before: "input_datetime.test",
      },
      {
        condition: "time",
        weekday: ["fri"],
      },
    ],
  } as AutomationCondition,
});

export const MultipleConditions: ComponentStory<typeof ConditionEditor> = (
  args
) => {
  const [state, setState] = useState<AutomationCondition>({
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
  });
  return (
    <MockPage>
      <ConditionEditor
        onUpdate={setState}
        onDelete={() => {}}
        condition={state}
      />
    </MockPage>
  );
};
