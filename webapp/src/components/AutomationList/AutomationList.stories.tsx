import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationList } from ".";
import { createMockAuto } from "utils/mocks";
import * as dgconst from 'components/DAGSvgs/constants';

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
  return <div className="page">
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
  </div>
}

export const EmptyStart = Template.bind({})
EmptyStart.args = {
  ...EmptyStart.args,
  automations: [],
}

export const FewAutos = Template.bind({})
FewAutos.args = {
  ...FewAutos.args,
  automations: [
    createMockAuto({ "Room": "Bathroom", "Type": "Lights", "NewDevice": "Yes", "Remote": "No", "Floor": "1" }),
    createMockAuto({ "Room": "Bathroom", "Type": "Climate" }),
    createMockAuto({ "Room": "Living Room", "Type": "Climate" }),
    createMockAuto({ "Type": "Climate" }),
    createMockAuto({ "Type": "Lights", "Routine": "Myself" }),
    createMockAuto({ "Routine": "DNS", "Type": "SSL" }),
    createMockAuto({ "Room": "Bedroom", "Type": "Lights", "Routine": "Baby" }),
    createMockAuto({ "Room": "Office", "Type": "Lights" }),
    createMockAuto({ "Room": "Office" }),
    createMockAuto(),
    {
      "metadata": {
        "id": "1649947692702",
        "alias": "Bed Remote",
        "description": "",
        "trigger_variables": null,
        "mode": "single"
      },
      "trigger": [
        {
          "device_id": "asdasdasdas",
          "domain": "zha",
          "platform": "device",
          "type": "remote_button_short_press",
          "subtype": "turn_on",
          "id": "turn_on"
        },
        {
          "device_id": "asdasdasdas",
          "domain": "zha",
          "platform": "device",
          "type": "remote_button_short_press",
          "subtype": "turn_off",
          "id": "turn_off"
        },
        {
          "device_id": "asdasdasdas",
          "domain": "zha",
          "platform": "device",
          "type": "remote_button_short_press",
          "subtype": "dim_up",
          "id": "dim_up"
        },
        {
          "device_id": "asdasdasdas",
          "domain": "zha",
          "platform": "device",
          "type": "remote_button_short_press",
          "subtype": "dim_down",
          "id": "dim_down"
        },
        {
          "device_id": "asdasdasdas",
          "domain": "zha",
          "platform": "device",
          "type": "remote_button_double_press",
          "subtype": "turn_on",
          "id": "up_dbclk"
        }
      ],
      "condition": [],
      "sequence": [
        {
          "choose": [
            {
              "conditions": [
                {
                  "condition": "trigger",
                  "id": "turn_off"
                }
              ],
              "sequence": [
                {
                  "type": "turn_off",
                  "device_id": "asdasdasdasdas",
                  "entity_id": "light.bulb_ari_lamp",
                  "domain": "light"
                }
              ]
            },
            {
              "conditions": [
                {
                  "condition": "trigger",
                  "id": "turn_on"
                }
              ],
              "sequence": [
                {
                  "service": "light.turn_on",
                  "data": {
                    "color_temp": 153,
                    "brightness_pct": 100
                  },
                  "target": {
                    "device_id": "asdasdasdasdas"
                  }
                }
              ]
            },
            {
              "conditions": [
                {
                  "condition": "trigger",
                  "id": "dim_up"
                }
              ],
              "sequence": [
                {
                  "device_id": "asdasdasdasdas",
                  "domain": "light",
                  "entity_id": "light.bulb_ari_lamp",
                  "type": "brightness_increase"
                }
              ]
            },
            {
              "conditions": [
                {
                  "condition": "trigger",
                  "id": "dim_down"
                }
              ],
              "sequence": [
                {
                  "device_id": "asdasdasdasdas",
                  "domain": "light",
                  "entity_id": "light.bulb_ari_lamp",
                  "type": "brightness_decrease"
                }
              ]
            },
            {
              "conditions": [
                {
                  "condition": "trigger",
                  "id": "up_dbclk"
                }
              ],
              "sequence": [
                {
                  "service": "light.turn_on",
                  "data": {
                    "color_temp": 500,
                    "brightness_pct": 100
                  },
                  "target": {
                    "device_id": "asdasdasdasdas"
                  }
                }
              ]
            }
          ],
          "default": []
        }
      ],
      "tags": {
        "Type": "Remote",
        "Room": "Bedroom"
      }
    },
    {
      "metadata": {
        "id": "1641617168123",
        "alias": "Ensure On",
        "description": "",
        "trigger_variables": null,
        "mode": "single"
      },
      "trigger": [
        {
          "platform": "device",
          "type": "turned_off",
          "device_id": "tasdasdasdasdasdasda",
          "entity_id": "switch.power_washer",
          "domain": "switch"
        },
        {
          "platform": "device",
          "type": "turned_off",
          "device_id": "dasdasdasdasdas",
          "entity_id": "switch.plug_living_room_tv",
          "domain": "switch"
        }
      ],
      "condition": [],
      "sequence": [
        {
          "type": "turn_on",
          "device_id": "tasdasdasdasdasdasda",
          "entity_id": "switch.power_washer",
          "domain": "switch"
        },
        {
          "type": "turn_on",
          "device_id": "dasdasdasdasdas",
          "entity_id": "switch.plug_living_room_tv",
          "domain": "switch"
        }
      ],
      "tags": {}
    }
  ],
}



export const BadAutmations = Template.bind({})
BadAutmations.args = {
  ...BadAutmations.args,
  automations: [
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
