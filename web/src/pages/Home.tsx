import { useState } from "react";
import AutomationDAG from "../components/AutomationDAG";
import { DAG } from "../components/AutomationDAG/types";
import { computeDAG } from "../components/AutomationDAG/dagFuncs";
// import AutomationEditor from "../components/AutomationEditor";
// import sample from "../sample/auto_01.yaml";

export function Home() {
  const [dag, setDag] = useState<DAG>(computeDAG({
    id: "root",
    alias: "root",
    description: 'root',
    mode: 'single',
    trigger: [
        {
            platform: 'time',
            at: '10:00:00'
        }
    ],
    condition: [
        {
            condition: 'template',
            value_template: 'states(switch.kitchen_light) == "on"'
        }
    ],
    action: [
        {
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
    ],
}))
  return (
    <div id="page--home" className="page">
        <AutomationDAG
            {...dag}
            onDelete={nodeId => {
              const nodes = {...dag.nodes};
              delete nodes[nodeId];
              const edges = dag.edges.filter(e => (e.from !== nodeId) && (e.to !== nodeId));
              setDag({nodes, edges});
            }}
            onOpenNode={nodeId => console.log({nodeId})}
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
