import React, { FC, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { DAGGraphBoard } from "components/DAGGraph/board";
import { AutomationTrigger } from "types/automations/triggers";
import { makeTriggerNodes, makeAutomationNodes } from ".";
import { useHA } from "haService";
import { AutomationActionData } from "types/automations";
import { createUpdaterFromAutomationData } from "../updater";
import { ModalState } from "../board/types";
import { DEFAULT_DIMS } from "./constants";

const Demo: FC<{
  automation: AutomationActionData;
  flipped: boolean;
}> = (props) => {
  const { namer } = useHA();
  const [state, setState] = useState<AutomationActionData>(props.automation);
  const [modalState, setModalState] =
    useState<ModalState | undefined>(undefined);
  const updater = createUpdaterFromAutomationData(
    setModalState,
    state,
    setState
  );
  const elementData = makeAutomationNodes(state, {
    dims: {
      ...DEFAULT_DIMS,
      flipped: props.flipped,
    },
    namer,
    openModal: setModalState,
    stateUpdater: updater,
  });
  return (
    <DAGGraphBoard
      modalState={modalState}
      closeModal={() => setModalState(undefined)}
      state={{
        ready: true,
        data: {
          elements: elementData,
        },
      }}
    />
  );
};

export default {
  title: "DAGGraph/Elements",
  component: Demo,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    flipped: true,
    automation: {
      trigger: [],
      condition: [],
      sequence: [],
    },
  },
} as ComponentMeta<typeof Demo>;

const Template: ComponentStory<typeof Demo> = (args) => (
  <Page>
    <Demo {...args} />
  </Page>
);

export const Empty = Template.bind({});
export const Trigger = Template.bind({});
Trigger.args = {
  ...Trigger.args,
  automation: {
    trigger: [
      { platform: "homeassistant", event: "up" },
      {
        platform: "tag",
        tag_id: "Test Me",
        device_id: "testme",
        enabled: false,
      },
    ],
    condition: [],
    sequence: [],
  },
};
export const Conditions = Template.bind({});
Conditions.args = {
  ...Conditions.args,
  automation: {
    trigger: [
      {
        platform: "zone",
        zone: "zone.home",
        event: "enter",
        entity_id: "person.ari",
      },
    ],
    condition: [
      {
        condition: "and",
        conditions: [
          {
            condition: "numeric_state",
            entity_id: "sensor.temperature_kitchen",
            below: "15",
          },
          {
            condition: "template",
            value_template: 'states(switch.kitchen_light) == "on"',
          },
        ],
      },

      {
        condition: "numeric_state",
        entity_id: "sensor.temperature_kitchen",
        below: "15",
      },
    ],
    sequence: [],
  },
};
