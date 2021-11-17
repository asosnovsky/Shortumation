import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { AutomationData } from "~/automations/types";
import { usePageTheme } from "~/styles/page";
import AutomationEditor from ".";

export default {
    title: 'AutomationEditor',
    component: AutomationEditor,
    parameters: { actions: { argTypesRegex: '^on.*' } },
  } as ComponentMeta<typeof AutomationEditor>;
  

const Template: ComponentStory<typeof AutomationEditor> = ({automation, ...args}) => {
    const {classes} = usePageTheme({});
    const [data, setData] = useState(automation);
    return <div className={classes.page}>
    <AutomationEditor {...args} 
        automation={data} 
        onUpdate={data => {
            setData(data)
        }}
    />
</div> 
}

export const ServiceAction = Template.bind({})
ServiceAction.args = {
    automation: {
        metadata: {
          id: "X12314akx",
          alias: "root",
          description: 'Really Long Description',
          mode: 'single',
        },
        trigger: [
          {
              platform: 'time',
              at: '10:00:00'
          },
          {
            platform: "device",
            device_id: "34749",
            domain: "zha",
            type: "remote_button_double_press",
            subtype: "remote_button_double_press"
          }
        ],
        sequence: [
          {
              $smType: "condition",
              condition: 'and',
              condition_data: {
                conditions: [
                  {
                    $smType: 'condition',
                    condition: 'numeric_state',
                    condition_data: {
                      entity_id: 'sensor.temperature_kitchen',
                      below: '15',
                    }
                  },
                  {
                    $smType: "condition",
                    condition: 'template',
                    condition_data: {
                      value_template: 'states(switch.kitchen_light) == "on"'
                    }
                  }
                ]
              }
          },
          {
              $smType: "action",
              action: "service",
              action_data: {
                alias: "Start Music In Kitchen",
                service: 'media_player.play_media',
                target: {
                    entity_id: "media_player.kitchen_dot"
                },
                data: {
                    media_content_id: "Good Morning",
                    media_content_type: "SPOTIFY",
                }
              }
          }
        ],
    } as AutomationData
}


export const ChooseAction = Template.bind({})
ChooseAction.args = {
    automation: {
        metadata: {
          id: "X12314akx",
          alias: "root",
          description: 'Really Long Description',
          mode: 'single',
        },
        trigger: [
          {
              platform: 'time',
              at: '10:00:00'
          },
          {
            platform: "device",
            device_id: "34749",
            domain: "zha",
            type: "remote_button_double_press",
            subtype: "remote_button_double_press"
          }
        ],
        sequence: [
          {
              $smType: "condition",
              condition: 'and',
              condition_data: {
                conditions: [
                  {
                    $smType: 'condition',
                    condition: 'numeric_state',
                    condition_data: {
                      entity_id: 'sensor.temperature_kitchen',
                      below: '15',
                    }
                  },
                  {
                    $smType: "condition",
                    condition: 'template',
                    condition_data: {
                      value_template: 'states(switch.kitchen_light) == "on"'
                    }
                  }
                ]
              }
          },
          {
              $smType: "action",
              action: "choose",
              action_data: {
                choose: [
                  {
                    conditions: [
                      {
                        $smType: "condition",
                        condition: 'time',
                        condition_data: {
                          after: {
                            hours: 16,
                            minutes: 30
                          }
                        }
                      }
                    ],
                    sequence: [
                      {
                        $smType: 'action',
                        action: 'event',
                        action_data: {
                          event: "superImportant_time",
                          event_data: {
                            time: '4:30PM'
                          }
                        }
                      }
                    ]
                  },
                  {
                    conditions: [
                      {
                        $smType: "condition",
                        condition: 'time',
                        condition_data: {
                          after: {
                            hours: 18,
                            minutes: 45
                          }
                        }
                      }
                    ],
                    sequence: [
                      {
                        $smType: 'action',
                        action: 'event',
                        action_data: {
                          event: "superImportant_time",
                          event_data: {
                            time: '6:45PM'
                          }
                        }
                      }
                    ]
                  }
                ]
              }
          }
        ],
    } as AutomationData
}