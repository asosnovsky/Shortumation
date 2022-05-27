import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationList } from ".";
import { bigMockAutoList } from "utils/mocks";
import * as dgconst from 'components/DAGFlow/constants';
import { Page } from "components/Page";

export default {
  title: 'App/AutomationList',
  component: AutomationList,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    dims: dgconst.DEFAULT_DIMS
  }
} as ComponentMeta<typeof AutomationList>;


const Template: ComponentStory<typeof AutomationList> = args => {
  const [autos, setAutos] = useState(args.automations)
  return <Page>
    <AutomationList {...args} automations={autos}
      onAdd={a => {
        args.onAdd(a);
        setAutos([...autos, a]);
      }}
      onRemove={i => {
        args.onRemove(i);
        setAutos([
          ...autos.slice(0, i),
          ...autos.slice(i + 1),
        ]);
      }}
      onUpdate={(i, a) => {
        args.onUpdate(i, a);
        setAutos([
          ...autos.slice(0, i),
          a,
          ...autos.slice(i + 1),
        ]);
      }}
    />
  </Page>
}

export const EmptyStart = Template.bind({})
EmptyStart.args = {
  ...EmptyStart.args,
  automations: [],
}

export const FewAutos = Template.bind({})
FewAutos.args = {
  ...FewAutos.args,
  automations: bigMockAutoList,
}



export const BadAutmations = Template.bind({})
BadAutmations.args = {
  ...BadAutmations.args,
  automations: [
    {
      "metadata": {
        "alias": "Set Thermostat to 76 at 8am",
        "description": "",
        "mode": "single",
      } as any,
      "trigger": [
        {
          "at": "08:00:00",
          "platform": "time"
        }
      ],
      "condition": [
        {
          "condition": "state",
          "entity_id": "climate.thermostat",
          "state": "cool"
        }
      ],
      "sequence": [
        {
          "data": {
            "temperature": 76
          },
          "service": "climate.set_temperature",
          "target": {
            "entity_id": "climate.thermostat"
          }
        }
      ],
      "tags": {},
    },
    {
      condition: [],
      tags: {},
      metadata: {
        id: "Bad Choose Sequence",
        alias: "Bad Choose",
        description: "Example Metadata",
        trigger_variables: {
          'wowo': '!'
        },
        mode: 'single',
      },
      trigger: [],
      sequence: [
        {
          choose: {}
        }
      ] as any
    },
    {
      condition: [],
      tags: {},
      metadata: {
        id: "random",
        alias: "Bad Trigger",
        description: "Example Metadata",
        trigger_variables: {
          'wowo': '!'
        },
        mode: 'single',
      },
      trigger: [
        "haha I am a string"
      ] as any,
      sequence: []
    },
    {
      condition: [],
      tags: {},
      metadata: {
      } as any,
      trigger: [
      ],
      sequence: []
    }
  ],
}


export const FewAutosWithSlowLoader: ComponentStory<typeof AutomationList> = args => {
  const [autos, setAutos] = useState(args.automations)
  return <Page>
    <AutomationList {...args} automations={autos}
      onAdd={a => {
        window.setTimeout(() => {
          args.onAdd(a);
          setAutos([...autos, a]);
        }, 10000)
      }}
      onRemove={i => {
        window.setTimeout(() => {
          args.onRemove(i);
          setAutos([
            ...autos.slice(0, i),
            ...autos.slice(i + 1),
          ]);
        }, 10000)
      }}
      onUpdate={(i, a) => {
        window.setTimeout(() => {
          args.onUpdate(i, a);
          setAutos([
            ...autos.slice(0, i),
            a,
            ...autos.slice(i + 1),
          ]);
        }, 10000)
      }}
    />
  </Page>
}
FewAutosWithSlowLoader.args = {
  ...FewAutosWithSlowLoader.args,
  automations: bigMockAutoList,
}
