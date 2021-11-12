import { AutomationData } from "~/automations/types";
import useWindowSize from "~/utils/useWindowSize";
import AutoInfoBox from "./AutoInfoBox";

interface Props {
    automation: AutomationData;
    onUpdate: (auto: AutomationData) => void;
}
export default function AutomationEditor({
    automation,
    onUpdate,
}: Props) {

    const {ratioWbh} = useWindowSize();

    const graphHeight = 300;
    const graphWidth = Math.round(graphHeight * ratioWbh);
    console.log({ratioWbh, graphHeight, graphWidth})
    return <div className="automation-editor" style={{
        flexDirection: ratioWbh >= 0.75 ? 'row' : 'column'
    }}>
        <AutoInfoBox 
            metadata={automation.metadata}
            onUpdate={metadata => onUpdate({...automation, metadata})}
        />
        <div className="automation-editor-dag">
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
                {/* <rect x="1" y="1" height={GRAPH_HEIGHT-1} width={GRAPH_WIDTH} stroke="white" fill="none"/> */}
                {/* <g className="automation-dag-edges">
                    
                </g>
                <g className="automation-dag-nodes">
                    
                </g> */}
            </svg>
        </div>
</div>
}