import "styles/root.css";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationList } from ".";
import { createMockAuto } from "utils/mocks";
import * as dgconst from 'components/DAGFlow/constants';

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
    },
    {
      "metadata": {
        "id": "1649726828269",
        "alias": "Climate Heat Mode Settings",
        "description": "Ensures that the climate is always in sync with the house settings",
        "trigger_variables": null,
        "mode": "single"
      },
      "trigger": [
        {
          "platform": "state",
          "entity_id": "climate.main_floor",
          "id": "main"
        },
        {
          "platform": "state",
          "entity_id": "climate.second_floor",
          "id": "second"
        },
        {
          "platform": "state",
          "entity_id": "input_boolean.thermostats_house_is_heating",
          "id": "setting"
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
                  "id": "setting"
                }
              ],
              "sequence": [
                {
                  "service": "climate.turn_off",
                  "data": {},
                  "target": {
                    "device_id": [
                      "d88dcfe82bc9a1c0f2b77b871848155e",
                      "ef2d47fdeef19f8984b85f92f2597f73"
                    ]
                  }
                }
              ]
            },
            {
              "conditions": [
                {
                  "condition": "state",
                  "entity_id": "input_boolean.thermostats_house_is_heating",
                  "state": "on"
                }
              ],
              "sequence": [
                {
                  "choose": [
                    {
                      "conditions": [
                        {
                          "condition": "and",
                          "conditions": [
                            {
                              "condition": "template",
                              "value_template": "{{ trigger.to_state.state != 'heat' }}"
                            },
                            {
                              "condition": "template",
                              "value_template": "{{ trigger.to_state.state != 'off' }}"
                            }
                          ]
                        }
                      ],
                      "sequence": [
                        {
                          "service": "climate.set_hvac_mode",
                          "data": {
                            "hvac_mode": "heat"
                          },
                          "target": {
                            "entity_id": "{{ trigger.entity_id }}"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "default": [
            {
              "choose": [
                {
                  "conditions": [
                    {
                      "condition": "and",
                      "conditions": [
                        {
                          "condition": "template",
                          "value_template": "{{ trigger.to_state.state != 'cool' }}"
                        },
                        {
                          "condition": "template",
                          "value_template": "{{ trigger.to_state.state != 'off' }}"
                        }
                      ]
                    }
                  ],
                  "sequence": [
                    {
                      "service": "climate.set_hvac_mode",
                      "data": {
                        "hvac_mode": "cool"
                      },
                      "target": {
                        "entity_id": "{{ trigger.entity_id }}"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      "tags": {}
    },
    {
      "metadata": {
        "id": "1628024070687",
        "alias": "Baby Light Setting",
        "description": "Configures max/min light settings for the baby ",
        "trigger_variables": null,
        "mode": "single"
      },
      "trigger": [
        {
          "platform": "time",
          "at": "21:00:00",
          "id": "night"
        },
        {
          "platform": "time",
          "at": "07:30:00",
          "id": "day"
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
                  "id": "night"
                }
              ],
              "sequence": [
                {
                  "service": "zwave_js.set_config_parameter",
                  "data": {
                    "parameter": "5",
                    "value": "15"
                  }
                }
              ]
            },
            {
              "conditions": [
                {
                  "condition": "trigger",
                  "id": "day"
                }
              ],
              "sequence": [
                {
                  "service": "zwave_js.set_config_parameter",
                  "data": {
                    "parameter": "5",
                    "value": 100
                  }
                }
              ]
            }
          ],
          "default": []
        }
      ],
      "tags": {}
    },
    {
      "metadata": {
        "id": "alarmanlage_an",
        "alias": "alarmanlage_an (Uhrzeit)",
        "mode": "single"
      },
      tags: {},
      "trigger": [
        {
          "entity_id": "sensor.time",
          "platform": "state",
          "to": "23:30"
        }
      ],
      "condition": [
        {
          "condition": "or",
          "conditions": [
            {
              "condition": "state",
              "entity_id": "person.simon",
              "state": "home"
            },
            {
              "condition": "state",
              "entity_id": "person.leni",
              "state": "home"
            }
          ]
        }
      ],
      "sequence": [
        {
          "service": "alarm_control_panel.alarm_arm_night",
          "target": {
            "entity_id": [
              "alarm_control_panel.alarmo"
            ]
          },
          "data": {
            "code": "xxx"
          }
        },
        {
          "service": "alarm_control_panel.alarm_arm_away",
          "data": {},
          "target": {
            "entity_id": "alarm_control_panel.blink_home"
          }
        }
      ],
    }
  ],
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
