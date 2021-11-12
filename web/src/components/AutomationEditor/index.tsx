import { AutomationData } from "~/automations/types";
import { AutomationCondition } from "~/automations/types/conditions";
import { AutomationTrigger } from "~/automations/types/triggers";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import useWindowSize from "~/utils/useWindowSize";
import AutoInfoBox from "./AutoInfoBox";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import DAGEdge from "./DAGEdge";
import DAGNode from "./DAGNode";
import { Point } from "./types";

interface Props {
    automation: AutomationData;
    onUpdate: (auto: AutomationData) => void;
}
export default function AutomationEditor({
    automation,
    onUpdate,
}: Props) {

    // state
    const {ratioWbh} = useWindowSize();

    // alias
    const nHDF = 1.5 // node horizontal distance factor
    const graphHeight = 300;
    const graphWidth = Math.round(graphHeight * ratioWbh);
    const pointTrigToCond: Point = [NODE_WIDTH*nHDF, NODE_HEIGHT/2]

    // render funcs
    const renderTrigger = (trigger: AutomationTrigger, i: number) => {
        const nodeLoc: Point = [0 ,i*NODE_HEIGHT*1.25];
        return <>
            <DAGNode key={`node.${i}`} loc={nodeLoc} text={getDescriptionFromAutomationNode(trigger)} color="red"/>
            <DAGEdge 
                key={`edge.${i}`}
                p1={[NODE_WIDTH , nodeLoc[1] + 0.5 * NODE_HEIGHT]} 
                p2={pointTrigToCond} 
                direction="1->2" 
            />
        </>
    }
    const renderMidCondition = (condition: AutomationCondition, i: number) => {
        const nodeLoc: Point = [pointTrigToCond[0] + NODE_WIDTH/2 , 0];
        let lastNodeLoc = pointTrigToCond;
        if (i > 0) {
            lastNodeLoc = [nodeLoc[0] + NODE_WIDTH*((i - 1)*nHDF+1), nodeLoc[1] + NODE_HEIGHT/2];
            nodeLoc[0] += NODE_WIDTH*i*nHDF
        }
        return <>
            <DAGNode key={`node.${i}`} loc={nodeLoc} text={getDescriptionFromAutomationNode(condition)} color="blue"/>
            <DAGEdge 
                key={`edge.${i}`}
                p1={lastNodeLoc}
                p2={[nodeLoc[0], nodeLoc[1] + NODE_HEIGHT/2]} 
                direction="1->2" 
            />
        </>
    }

    // render
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
                <g className="triggers">
                    {automation.trigger.map(renderTrigger)}  
                </g>       
                <g className="conditions">
                    {automation.condition.map(renderMidCondition)}  
                </g>       
                <circle className="blue" cx={pointTrigToCond[0]} cy={pointTrigToCond[1]} r={2}/>
                <g className="actions">
                </g>       
            </svg>
        </div>
</div>
}