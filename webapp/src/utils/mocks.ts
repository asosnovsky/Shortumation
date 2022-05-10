import { AutomationData } from 'types/automations';


export const createMockAuto = (tags: Record<string, string> = {}): AutomationData => ({
  metadata: {
    id: Math.random().toString(36).slice(2, 15),
    alias: "Random",
    description: "Example Metadata",
    trigger_variables: {
      'wowo': '!'
    },
    mode: 'single',
  },
  tags,
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
})
