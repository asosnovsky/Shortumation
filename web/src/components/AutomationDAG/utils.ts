
import { Automation } from "../../automation/types";
import { GRAPH_HEIGHT, GRAPH_WIDTH, NODE_HEIGHT, NODE_WIDTH } from "./constants";
import {DAG, Node, Point, NormalizedDag} from "./types";


export const clip = (p: Point) : Point => {
    const [x,y] = p.map(c => Math.max(0, c));
    return [Math.min(GRAPH_WIDTH-NODE_WIDTH, x), Math.min(GRAPH_HEIGHT-NODE_HEIGHT, y)]
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
export const computeDAG = (automation: Automation) : DAG => {
    const nodes: DAG['nodes'] = {};
    const edges: DAG['edges'] = [];

    automation.action

    // let currentNode: InputDagNode | null = rootNode;
    // let currLoc: Point = [0,0];
    // let idPath = '';
    // // let 
    // while (currentNode) {
    //     const n = {
    //         text: currentNode.display,
    //         loc: currLoc,
    //     }
    //     if(idPath) {
    //         nodes[idPath + "." + currentNode.name] = n
    //         edges
    //     }   else {
    //         nodes[currentNode.name] = n
    //     }
    //     currentNode = currentNode.next[0]
    // }

    return {
        nodes, edges
    }
}