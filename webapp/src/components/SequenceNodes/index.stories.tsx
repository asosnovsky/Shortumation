import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SequenceNodes } from './index';
import { NODE_HEIGHT, NODE_WIDTH, DISTANCE_FACTOR, ADD_HEIGHT, ADD_WIDTH, CIRCLE_SIZE } from '../DAGSvgs/constants';
import { useState } from 'react';


export default {
  title: 'DAGSvgs/SequenceNodes',
  component: SequenceNodes,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    zoomLevel: 1,
    startPoint: [0.5, 0.5],
    dims: {
      nodeHeight: NODE_HEIGHT,
      nodeWidth: NODE_WIDTH,
      addHeight: ADD_HEIGHT,
      addWidth: ADD_WIDTH,
      circleSize: CIRCLE_SIZE,
      distanceFactor: DISTANCE_FACTOR,
    }
  }
} as ComponentMeta<typeof SequenceNodes>

const Template: ComponentStory<typeof SequenceNodes> = args => {
  const [state, setState] = useState(args.sequence)
  return <SequenceNodes
    {...args}
    sequence={state}
    onChange={setState}
  />
}

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
            conditions: [],
            sequence: []
          },
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
        ],
        default: [],
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

export const DeepNested = Template.bind({})
DeepNested.args = {
  ...DeepNested.args,
  sequence: [
    {
      "$smType": "action",
      "action": "choose",
      "action_data": {
        "choose": [{
          "sequence": [{
            "$smType": "action",
            "action": "choose",
            "action_data": {
              "choose": [],
              "default": []
            }
          }],
          "conditions": [],
        }],
        "default": [
          {
            "$smType": "action",
            "action": "choose",
            "action_data": {
              "choose": [
                {
                  "sequence": [{
                    "$smType": "action",
                    "action": "choose",
                    "action_data": {
                      "choose": [],
                      "default": []
                    }
                  }],
                  "conditions": [],
                }
              ],
              "default": [

              ]
            }
          },
          {
            "$smType": "action",
            "action": "choose",
            "action_data": {
              "choose": [],
              "default": []
            }
          }
        ]
      }
    },
    {
      "$smType": "action",
      "action": "choose",
      "action_data": {
        "choose": [],
        "default": []
      }
    }
  ]
}

export const SubsequentIssue = Template.bind({})
SubsequentIssue.args = {
  ...SubsequentIssue.args,
  sequence: [{ "$smType": "condition", "condition": "and", "condition_data": { "conditions": [{ "$smType": "condition", "condition": "numeric_state", "condition_data": { "entity_id": "sensor.temperature_kitchen", "below": "15" } }, { "$smType": "condition", "condition": "template", "condition_data": { "value_template": "states(switch.kitchen_light) == \"on\"" } }] } }, { "$smType": "action", "action": "service", "action_data": { "alias": "Start Music In Kitchen", "service": "media_player.play_media", "target": { "entity_id": "media_player.kitchen_dot" }, "data": { "media_content_id": "Good Morning", "media_content_type": "SPOTIFY" } } }, { "$smType": "action", "action": "choose", "action_data": { "choose": [], "default": [{ "$smType": "action", "action": "choose", "action_data": { "choose": [], "default": [] } }] } }, { "$smType": "action", "action": "choose", "action_data": { "choose": [], "default": [] } }, { "$smType": "action", "action": "choose", "action_data": { "choose": [], "default": [] } }]
}
