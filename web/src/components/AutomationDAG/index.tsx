import { useEffect, useRef, useState } from "react"
import { GRAPH_HEIGHT, GRAPH_WIDTH, NODE_WIDTH } from "./constants";
import DAGEdge from "./DAGEdge";
import DAGNode from "./DAGNode";
import { DAG, Node } from "./types";
import { normalizeDAG } from "./utils";
export interface Props extends DAG {

}
export default function AutomationDAG({
    ...dag
}: Props) {
    // state
    const [{nodes, edges}, _setDAG] = useState(normalizeDAG(dag));

    // set state
    const setDAG = (dag: DAG) => _setDAG(normalizeDAG(dag));
    const removeNode = (nodeId: string) => () => {
        const newNodes = {...nodes}
        delete newNodes[nodeId];
        _setDAG({
            nodes: newNodes,
            edges: edges.filter(e => e.from !== nodeId && e.to !== nodeId),
        })
    }
    // render
    return <div className="automation-dag" >
        <svg 
            viewBox={[0,0,GRAPH_WIDTH, GRAPH_HEIGHT].join(" ")}
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
            <g className="automation-dag-edges">
                {edges.map(({from, to, direction}, i) => <DAGEdge 
                        key={i}
                        p1={nodes[from].loc}
                        p2={nodes[to].loc}
                        direction={direction}
                    />
                )}
            </g>
            <g className="automation-dag-nodes">
                {Object.keys(nodes).map((nodeId) => 
                    <DAGNode key={nodeId} {...nodes[nodeId]} onXClick={removeNode(nodeId)}/>
                )}
            </g>
        </svg>
    </div>
}