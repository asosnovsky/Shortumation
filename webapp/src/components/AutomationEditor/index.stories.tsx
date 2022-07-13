import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { AutomationEditor } from "./index";
import { useState } from "react";
import { Page } from "components/Page";
import { makeTagDB } from "components/AutomationList/TagDB";
import { DEFAULT_DIMS } from "components/DAGGraph/elements/constants";

export default {
  title: "App/AutomationList/Editor",
  component: AutomationEditor,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  args: {
    dims: DEFAULT_DIMS,
  },
} as ComponentMeta<typeof AutomationEditor>;

const Template: ComponentStory<typeof AutomationEditor> = (args) => {
  const [state, setState] = useState(args.automation);
  return (
    <Page>
      <AutomationEditor
        {...args}
        tagDB={makeTagDB(state ? [state] : [])}
        automation={state}
        onUpdate={(s) => {
          window.setTimeout(() => setState(s), 3000);
        }}
      />
    </Page>
  );
};

export const Loading = Template.bind({});

export const Simple = Template.bind({});
Simple.args = {
  ...Simple.args,
  automation: {
    condition: [],
    tags: {
      Room: "Bathroom",
      For: "Toliet",
      Type: "Smell",
      Use: "Flushing",
    },
    metadata: {
      id: "random",
      alias: "Random",
      description: "Example Metadata",
      trigger_variables: {
        wowo: "!",
      },
      mode: "single",
    },
    trigger: [
      {
        platform: "numeric_state",
        entity_id: "test",
      },
      {
        platform: "homeassistant",
        event: "start",
      },
    ],
    sequence: [
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
        alias: "Start Music In Kitchen",
        service: "media_player.play_media",
        target: {
          entity_id: "media_player.kitchen_dot",
        },
        data: {
          media_content_id: "Good Morning",
          media_content_type: "SPOTIFY",
        },
      },
    ],
  },
};

export const EmptyStart = Template.bind({});
EmptyStart.args = {
  ...EmptyStart.args,
  automation: {
    condition: [],
    tags: {},
    metadata: {
      id: "random",
      alias: "Random",
      description: "Example Metadata",
      trigger_variables: {
        wowo: "!",
      },
      mode: "single",
    },
    trigger: [],
    sequence: [],
  },
};

export const BadAutomationInvalidMetadata = Template.bind({});
BadAutomationInvalidMetadata.args = {
  ...BadAutomationInvalidMetadata.args,
  automation: {
    condition: [],
    tags: {},
    metadata: {} as any,
    trigger: [],
    sequence: [],
  },
};

export const BadAutomationInvalidTriggers = Template.bind({});
BadAutomationInvalidTriggers.args = {
  ...BadAutomationInvalidTriggers.args,
  automation: {
    condition: [],
    tags: {},
    metadata: {
      id: "random",
      alias: "Random",
      description: "Example Metadata",
      trigger_variables: {
        wowo: "!",
      },
      mode: "single",
    },
    trigger: ["haha I am a string"] as any,
    sequence: [],
  },
};

export const BadAutomationInvalidSequence = Template.bind({});
BadAutomationInvalidSequence.args = {
  ...BadAutomationInvalidSequence.args,
  automation: {
    condition: [],
    tags: {},
    metadata: {
      id: "random",
      alias: "Bad Choose Sequence",
      description: "Example Metadata",
      trigger_variables: {
        wowo: "!",
      },
      mode: "single",
    },
    trigger: [],
    sequence: [
      {
        choose: {},
      },
    ] as any,
  },
};

export const RepeatExample = Template.bind({});
RepeatExample.args = {
  ...RepeatExample.args,
  automation: {
    metadata: {
      id: "1654976151462",
      alias: "Get out of baby room",
      description: "",
      mode: "single",
    },
    trigger: [
      {
        type: "opened",
        platform: "device",
        device_id: "9b33663d2700da8efe0c31c946448f77",
        entity_id: "binary_sensor.door_baby",
        domain: "binary_sensor",
      },
    ],
    condition: [],
    sequence: [
      {
        service: "notify.mobile_app_levas_phone",
        data: {
          message: "Someone is in Korie’s room!!!",
        },
      },
      {
        repeat: {
          while: [
            {
              type: "is_open",
              condition: "device",
              device_id: "9b33663d2700da8efe0c31c946448f77",
              entity_id: "binary_sensor.door_baby",
              domain: "binary_sensor",
            },
          ],
          sequence: [
            {
              service: "notify.alexa_media",
              data: {
                message:
                  "Get the fuck out of the baby’s bedroom you sick fuck! This room belongs to Korie! Close the door! I said close. The. Door!",
                data: null,
                type: "tts",
                target: "media_player.baby_bedroom_dot",
              },
            },
            {
              delay: {
                hours: 0,
                minutes: 0,
                seconds: 7,
                milliseconds: 0,
              },
            },
          ],
        },
      },
      {
        service: "light.turn_off",
        target: {
          entity_id: ["light.switch_baby"],
        },
        data: {
          flash: "short",
        },
      },
    ],
    tags: {},
  },
};
