
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
    return {
        nodes,
        edges: dag.edges,
    }
}
export const computeDAG = (automation: Automation) : DAG => {
    const nodes: DAG['nodes'] = {};
    const edges: DAG['edges'] = [];

    const triggerIds: string[] = [];
    automation.trigger.forEach((t,i) => {
        nodes[`trigger.${i}`] = {
            loc: [0, 5+NODE_HEIGHT*i*1.5],
            text: "",
            color: 'green',
        }
        triggerIds.push(`trigger.${i}`);
    })

    let lastConditionId: string | undefined = undefined;
    automation.condition.forEach((c,i) => {
        const cid = `condition.${i}`;
        nodes[cid] = {
            loc: [NODE_WIDTH*1.5, 5+NODE_HEIGHT*i*1.5],
            text: "",
            color: 'blue',
        }
        lastConditionId = cid;
        if (i === 0) {
            triggerIds.forEach(tid => edges.push({
                from: tid, to: cid, direction: '1->2',
            }));
        }   else {
            edges.push({
                from: lastConditionId, to: cid, direction: '1->2',
            })
        }
    });
    if (!lastConditionId) {
        if(triggerIds.length > 0) {
            lastConditionId = triggerIds[triggerIds.length-1]
        }
    }
    
    const actionIds: string[] = [];
    automation.action.forEach((c,i) => {
        const aid = `action.${i}`;
        nodes[aid] = {
            loc: [NODE_WIDTH*3, 5+NODE_HEIGHT*i*1.5],
            text: "",
            color: 'red',
        }
        actionIds.push(aid);
        if (i === 0) {
            if (lastConditionId) {
                edges.push({
                    from: lastConditionId, to: aid, direction: '1->2',
                });
            }
        }   else {
            edges.push({
                from: `action.${i-1}`, to: aid, direction: '1->2',
            })
        }
    })

    return {
        nodes, edges
    }
}