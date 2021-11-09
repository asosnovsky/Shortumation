
import { GRAPH_HEIGHT, GRAPH_WIDTH, NODE_HEIGHT, NODE_WIDTH } from "./constants";
import {DAG, Node, Point} from "./types";


export const clip = (p: Point) : Point => {
    const [x,y] = p.map(c => Math.max(0, c));
    return [Math.min(GRAPH_WIDTH-NODE_WIDTH, x), Math.min(GRAPH_HEIGHT-NODE_HEIGHT, y)]
}
export interface NormalizedDag extends DAG {
    // overflow: boolean;
}
export const normalizeDAG = (dag: DAG): NormalizedDag => {
    // let overflow: bo
    const nodes = Object.keys(dag.nodes).map<[string, Node]>(nodeId => [nodeId, {
        ...dag.nodes[nodeId],
        loc: clip(dag.nodes[nodeId].loc),
    }]).reduce((all, [nodeId, next]) => ({
        [nodeId]: next,
        ...all,
    }),{});
    // dag.edges.forEach(edge => {
    //     const n1 = nodes[edge.from];
    //     const n2 = nodes[edge.to];
    //     n2.loc[0] = Math.max(n2.loc[0], n1.loc[0] + 1.25*NODE_WIDTH)
    // })

    return {
        nodes,
        edges: dag.edges,
    }
}