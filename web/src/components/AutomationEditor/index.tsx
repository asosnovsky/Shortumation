import { AutomationData } from "~/automations/types";
import AutoInfoBox from "./AutoInfoBox";

interface Props {
    automation: AutomationData;
    onUpdate: (auto: AutomationData) => void;
}
export default function AutomationEditor({
    automation,
    onUpdate,
}: Props) {

    const graphWidth = 300;
    const graphHeight = 300;

    return <div className="automation-dag" >
    <svg 
        viewBox={[0,0,graphWidth, graphHeight].join(" ")}
        xmlns="http://www.w3.org/2000/svg" 
    >
        <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        </defs>
        <AutoInfoBox 
            metadata={automation.metadata}
            onUpdate={metadata => onUpdate({...automation, metadata})}
        />
        {/* <rect x="1" y="1" height={GRAPH_HEIGHT-1} width={GRAPH_WIDTH} stroke="white" fill="none"/> */}
        {/* <g className="automation-dag-edges">
            
        </g>
        <g className="automation-dag-nodes">
            
        </g> */}
    </svg>
</div>
}