import { useState } from "react";
import { AutomationData } from "../automations/types";
import AutomationEditor from "../components/AutomationEditor";

export function Home() {
  const [automation, setAutomation] = useState<AutomationData>({
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
      condition: [
          {
            $smType: "condition",
            condition: 'template',
            condition_data: {
              value_template: 'states(switch.kitchen_light) == "on"'
            }
        },
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
                }
              ]
            }
        }
      ],
      action: [
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
  });
  return (
    <div id="page--home" className="page">
        <AutomationEditor
            automation={automation}
            onUpdate={setAutomation}
        />
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100vw"
        }}
      >
        <AutomationEditor automation={sample}/>
      </div> */}
    </div>
  );
}
