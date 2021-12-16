import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AutomationEditor } from './index';
import { NODE_HEIGHT, NODE_WIDTH, DISTANCE_FACTOR, ADD_HEIGHT, ADD_WIDTH, CIRCLE_SIZE } from '../DAGSvgs/constants';
import { useState } from 'react';
import { usePageTheme } from "styles/page";


export default {
  title: 'AutomationEditor/AutomationEditor',
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
  const { classes } = usePageTheme({});
  return <div className={classes.page}>
    <AutomationEditor
      {...args}
      automation={state}
      onUpdate={setState}
    />
  </div>
}

export const Simple = Template.bind({})
Simple.args = {
  ...Simple.args,
  automation: {
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
