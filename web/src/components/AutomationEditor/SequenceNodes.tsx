import { FC } from "react";
import { AutomationSequenceNode } from "~/automations/types";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import DAGEdge from "./DAGEdge";
import DAGNode from "./DAGNode";
import { useNodeStyles } from "./styles";
import { Point } from "./types";



export const SequenceNodes: FC<{ 
    styles: ReturnType<typeof useNodeStyles>,
    sequence: AutomationSequenceNode[],
    onUpdate: (s: AutomationSequenceNode[]) => void,
    nodeWidth: number,
    nodeHeight: number,
    triggerPoint: Point,
    nHDF: number,
}> = ({
    styles: { classes, theme },
    sequence,
    onUpdate,
    nodeWidth,
    nodeHeight,
    triggerPoint,
    nHDF,
}) => {
    const renderSequence = (node: AutomationSequenceNode, i: number) => {
        const nodeLoc: Point = [triggerPoint[0] + nodeWidth/2 , 0];
        let lastNodeLoc = triggerPoint;
        if (i > 0) {
            lastNodeLoc = [nodeLoc[0] + nodeWidth*((i - 1)*nHDF+1), nodeLoc[1] + nodeHeight/2];
            nodeLoc[0] += nodeWidth*i*nHDF
        }
        return <>
            <DAGNode 
                key={`node.${i}`} 
                loc={nodeLoc} 
                text={getDescriptionFromAutomationNode(node)}
                color={node.$smType === 'action' ? 'green' : 'blue'}
                onXClick={() => {
                    onUpdate([
                        ...sequence.slice(0, i),
                        ...sequence.slice(i+1),
                    ])
                }}
            />
            <DAGEdge 
                key={`edge.${i}`}
                p1={lastNodeLoc}
                p2={[nodeLoc[0], nodeLoc[1] + nodeHeight/2]} 
                direction="1->2" 
                className={classes.dagEdge}
            />
        </>
    }
    return <g id="sequence">
        {sequence.map(renderSequence)}  
    </g> 
}