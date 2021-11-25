import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SequenceNodes } from './index';
import { SVGBoard } from '../DAGSvgs/Board';
import { NODE_HEIGHT, NODE_WIDTH } from '../DAGSvgs/constants';


export default {
  title: 'DAGSvgs/SequenceNodes',
  component: SequenceNodes,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    nodeHeight: NODE_HEIGHT,
    nodeWidth: NODE_WIDTH,
    distanceFactor: 1.5,
    startLoc: [50,50]
  }
} as ComponentMeta<typeof SequenceNodes>

const Template: ComponentStory<typeof SequenceNodes> = args => <SVGBoard>
  <SequenceNodes
    {...args}
  />
</SVGBoard>

export const Simple = Template.bind({})
Simple.args = {
  ...Simple.args,
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
  ]
}

export const Multinode = Template.bind({})
Multinode.args = {
  ...Multinode.args,
  startLoc: [0,0],
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
    },
    {
      $smType: 'action',
      action: "service",
      action_data: {
        service: "light.turn_on",
        data: {
          entity_id: "light.kitchen"
        }
      }
    }
  ]
}
