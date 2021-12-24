import { AutomationData } from 'types/automations';


export const createMockAuto = (): AutomationData => ({
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
})
