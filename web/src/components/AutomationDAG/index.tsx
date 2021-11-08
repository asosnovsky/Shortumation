import { useEffect, useState } from "react"
import { GRAPH_HEIGHT, GRAPH_WIDTH, NODE_WIDTH } from "./constants";
import DAGEdge from "./DAGEdge";
import DAGNode from "./DAGNode";
import { DAG, Point } from "./types";
import { normalizeDAG } from "./utils";

const randomWalk = ([x,y]:Point) : Point => [
    Math.round(Math.max(0, Math.min(x + (Math.random() < 0.5 ? -1 : 1)* 10*Math.random(), 300))),
    Math.round(Math.max(0, Math.min(y + (Math.random() < 0.5 ? -1 : 1)* 10*Math.random(), 300))),
]

export interface Props extends DAG {

}
export default function AutomationDAG({
    ...dag
}: Props) {
    // const [mx, my] = [10, 100];
    // const [points, setPoints] = useState<Array<Point>>([
    //     [10+1.25*NODE_WIDTH, 25],
    //     [10+2*NODE_WIDTH, 100],
    //     [25+1.5*NODE_WIDTH, 170],
    //     [25+2*NODE_WIDTH, 170],
    // ])

    // useEffect(()=>{
    //     window.setTimeout(() => {
    //         setPoints(points.map(randomWalk))
    //     },1000)
    // });

    const {nodes, edges} = normalizeDAG(dag);
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
            <circle stroke="red" r="1" cx="0" cy="0"/>
            {nodes.map((node, i) => <>
                <DAGNode key={i} {...node}/>
            </>)}
            {edges.map(({from, to, direction}) => <>
                <DAGEdge 
                    key={`${from}-${to}`}
                    p1={nodes[from].loc}
                    p2={nodes[to].loc}
                    direction={direction}
                />
            </>)}
        </svg>
    </div>
}