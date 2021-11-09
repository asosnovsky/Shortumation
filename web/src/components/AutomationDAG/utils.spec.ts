
import { GRAPH_HEIGHT, GRAPH_WIDTH, NODE_HEIGHT, NODE_WIDTH } from "./constants";
import {clip, computeDAG} from "./utils";

test('it clips overflowing values', () => {
    expect(clip([GRAPH_WIDTH, GRAPH_HEIGHT])).toEqual([
        GRAPH_WIDTH-NODE_WIDTH,
        GRAPH_HEIGHT-NODE_HEIGHT
    ])
    expect(clip([-10, -10])).toEqual([
        0, 0
    ])
    expect(clip([0, 0])).toEqual([
        0, 0
    ])
})

test('simple empty input dag', () => {
    expect(computeDAG({
        id: "root",
        alias: "root",
        description: 'root',
        mode: 'single',
        trigger: [],
        condition: [],
        action: [
        ],
    })).toEqual({
        nodes: {},
        edges: [
        ],
    })
})