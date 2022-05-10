import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AutomationEditor } from './index';
import { useState } from 'react';
import * as dgconst from 'components/DAGSvgs/constants';


export default {
  title: 'App/AutomationList/Editor',
  component: AutomationEditor,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    dims: {
      nodeHeight: dgconst.NODE_HEIGHT,
      nodeWidth: dgconst.NODE_WIDTH,
      distanceFactor: dgconst.DISTANCE_FACTOR,
      circleSize: dgconst.CIRCLE_SIZE,
      padding: {
        x: dgconst.PADDING,
        y: dgconst.PADDING,
      },
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

export const Loading = Template.bind({});


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
        "platform": "numeric_state",
        "entity_id": "test",
      },
      {
        "platform": "homeassistant",
        "event": "start",
      }
    ],
    sequence: [
      {
        condition: 'and',
        conditions: [
          {
            condition: 'numeric_state',
            entity_id: 'sensor.temperature_kitchen',
            below: '15',
          },
          {
            condition: 'template',
            value_template: 'states(switch.kitchen_light) == "on"'
          }
        ]
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
