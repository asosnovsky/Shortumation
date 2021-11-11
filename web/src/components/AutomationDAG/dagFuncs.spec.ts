
import { GRAPH_HEIGHT, GRAPH_WIDTH, NODE_HEIGHT, NODE_WIDTH } from "./constants";
import { DAG } from "./types";
import {clip, computeDAG} from "./dagFuncs";

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
        metadata: {
            id: "root",
            alias: "root",
            description: 'root',
            mode: 'single',
        },
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

test('simple single node type input dag', () => {
    expect(computeDAG({
        metadata: {
            id: "root",
            alias: "root",
            description: 'root',
            mode: 'single',
        },
        trigger: [
            {
                platform: 'time',
                at: '10:00:00'
            }
        ],
        condition: [
            {
                $smType: 'condition',
                condition: 'template',
                condition_data: {
                    value_template: 'states(switch.kitchen_light) == "on"'
                }
            }
        ],
        action: [
            {
                $smType: 'action',
                action: "service",
                action_data: {
                    alias: "Start Music In Kitchen",
                    service: 'media_player.play_media',
                    target: {
                        entity_id: "media_player.kitchen_dot"
                    },
                    data: {
                        media_content_id: "Good Morning",
                        media_content_type: "SPOTIFY",
                    }
                }
            }
        ],
    })).toEqual({
        nodes: {
            "trigger.0": {
                text: '',
                // text: "At 10:00:00",
                loc: [0,5],
                color: 'green',
            },
            "condition.0": {
                loc: [NODE_WIDTH*1.5, 5],
                text: '',
                color: 'blue',
                // text: 'states(switch.kitchen_light) == "on"'
            },
            "action.0": {
                loc: [NODE_WIDTH*3, 5],
                text: '',
                color: 'red',
                // text: 'Start Music In Kitchen',
            }
        },
        edges: [
            { from: 'trigger.0', to: 'condition.0', direction: '1->2' },
            { from: 'condition.0', to: 'action.0', direction: '1->2' },
        ],
    } as DAG)
})


test('simple dag with no triggers', () => {
    expect(computeDAG({
        metadata: {
            id: "root",
            alias: "root",
            description: 'root',
            mode: 'single',
        },
        trigger: [
        ],
        condition: [
            {
                $smType: "condition",
                condition: 'template',
                condition_data: {
                    value_template: 'states(switch.kitchen_light) == "on"'
                }
            }
        ],
        action: [
            {
                $smType: "action",
                action: "service",
                action_data: {
                    alias: "Start Music In Kitchen",
                    service: 'media_player.play_media',
                    target: {
                        entity_id: "media_player.kitchen_dot"
                    },
                    data: {
                        media_content_id: "Good Morning",
                        media_content_type: "SPOTIFY",
                    }
                }
            }
        ],
    })).toEqual({
        nodes: {
            "condition.0": {
                loc: [NODE_WIDTH*1.5, 5],
                text: '',
                color: 'blue',
                // text: 'states(switch.kitchen_light) == "on"'
            },
            "action.0": {
                loc: [NODE_WIDTH*3, 5],
                text: '',
                color: 'red',
                // text: 'Start Music In Kitchen',
            }
        },
        edges: [
            { from: 'condition.0', to: 'action.0', direction: '1->2' },
        ],
    } as DAG)
})


test('simple dag with no conditions', () => {
    expect(computeDAG({
        metadata: {
            id: "root",
            alias: "root",
            description: 'root',
            mode: 'single',
        },
        trigger: [
            {
                platform: 'time',
                at: '10:00:00'
            }
        ],
        condition: [],
        action: [
            {
                $smType: 'action',
                action: 'service',
                action_data: {
                    alias: "Start Music In Kitchen",
                    service: 'media_player.play_media',
                    target: {
                        entity_id: "media_player.kitchen_dot"
                    },
                    data: {
                        media_content_id: "Good Morning",
                        media_content_type: "SPOTIFY",
                    }
                }
            }
        ],
    })).toEqual({
        nodes: {
            "trigger.0": {
                text: '',
                // text: "At 10:00:00",
                loc: [0,5],
                color: 'green',
            },
            "action.0": {
                loc: [NODE_WIDTH*3, 5],
                text: '',
                color: 'red',
                // text: 'Start Music In Kitchen',
            }
        },
        edges: [
            { from: 'trigger.0', to: 'action.0', direction: '1->2' },
        ],
    } as DAG)
})


test('simple dag with no actions', () => {
    expect(computeDAG({
        metadata: {
            id: "root",
            alias: "root",
            description: 'root',
            mode: 'single',
        },
        trigger: [
            {
                platform: 'time',
                at: '10:00:00'
            }
        ],
        condition: [
            {
                $smType: "condition",
                condition: 'template',
                condition_data: {
                    value_template: 'states(switch.kitchen_light) == "on"'
                }
            }
        ],
        action: [
        ],
    })).toEqual({
        nodes: {
            "trigger.0": {
                text: '',
                // text: "At 10:00:00",
                loc: [0,5],
                color: 'green',
            },
            "condition.0": {
                loc: [NODE_WIDTH*1.5, 5],
                text: '',
                color: 'blue',
                // text: 'states(switch.kitchen_light) == "on"'
            },
        },
        edges: [
            { from: 'trigger.0', to: 'condition.0', direction: '1->2' }
        ],
    } as DAG)
})

