import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AutomationEditor } from './index';
import { NODE_HEIGHT, NODE_WIDTH, DISTANCE_FACTOR, ADD_HEIGHT, ADD_WIDTH, CIRCLE_SIZE } from '../DAGSvgs/constants';
import { useState } from 'react';


export default {
  title: 'App/AutomationList/Editor',
  component: AutomationEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    dims: {
      nodeHeight: NODE_HEIGHT,
      nodeWidth: NODE_WIDTH,
      addHeight: ADD_HEIGHT,
      addWidth: ADD_WIDTH,
      circleSize: CIRCLE_SIZE,
      distanceFactor: DISTANCE_FACTOR,
    }
  }
} as ComponentMeta<typeof AutomationEditor>

const Template: ComponentStory<typeof AutomationEditor> = args => {
  const [state, setState] = useState(args.automation)
  return <div className="page">
    <AutomationEditor
      {...args}
      automation={state}
      onUpdate={s => {
        window.setTimeout(() => setState(s), 3000)
      }}
    />
  </div>
}

export const Simple = Template.bind({})
Simple.args = {
  ...Simple.args,
  automation: {
    tags: {
      "Room": "Bathroom",
      "For": "Toliet",
      "Type": "Smell",
      "Use": "Flushing"
    },
    metadata: {
      id: "random",
      alias: "Random",
      description: "Example Metadata",
      trigger_variables: {
        'wowo': '!'
      },
      mode: 'single',
    },
    trigger: [
      {
        "$smType": undefined,
        "platform": "numeric_state",
        "entity_id": "test",
      },
      {
        "$smType": undefined,
        "platform": "homeassistant",
        "event": "start",
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
    ]
  }
}


export const EmptyStart = Template.bind({})
EmptyStart.args = {
  ...EmptyStart.args,
  automation: {
    tags: {},
    metadata: {
      id: "random",
      alias: "Random",
      description: "Example Metadata",
      trigger_variables: {
        'wowo': '!'
      },
      mode: 'single',
    },
    trigger: [
    ],
    sequence: []
  }
}
