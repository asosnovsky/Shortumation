

import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGFlow } from '.';
import { useState } from 'react';
import * as dgconst from "components/DAGSvgs/constants";
import { makeAumationStateEditor } from '../../utils/AutomationState';


export default {
    title: 'DAGFlow/Viewer',
    component: DAGFlow,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    args: {
        dims: {
            nodeHeight: dgconst.NODE_HEIGHT,
            nodeWidth: dgconst.NODE_WIDTH,
            distanceFactor: dgconst.DISTANCE_FACTOR,
            circleSize: dgconst.CIRCLE_SIZE,
            padding: {
                x: dgconst.PADDING,
                y: dgconst.PADDING,
            },
        }
    }
} as ComponentMeta<typeof DAGFlow>

const Template: ComponentStory<typeof DAGFlow> = args => {
    const [state, setState] = useState(args.automation)
    const triggerEditor = makeAumationStateEditor(state, setState).triggers;
    return <div className="page">
        <DAGFlow
            {...args}
            automation={state}
            opts={{
                triggers: {
                    onAdd: () => triggerEditor.add({
                        platform: 'event',
                        $smType: 'trigger',
                        event_type: 'test',
                    }),
                    onDelete: triggerEditor.delete,
                    onEdit: () => { },
                }
            }}
        />
    </div>
}

export const Simple = Template.bind({})
Simple.args = {
    ...Simple.args,
    automation: {
        tags: {
            "Room": "Bathroom",
            "For": "Toliet",
            "Type": "Smell",
            "Use": "Flushing"
        },
        metadata: {
            id: "random",
            alias: "Random",
            description: "Example Metadata",
            trigger_variables: {
                'wowo': '!'
            },
            mode: 'single',
        },
        trigger: [
            {
                "$smType": undefined,
                "platform": "numeric_state",
                "entity_id": "test",
            },
            {
                "$smType": undefined,
                "platform": "homeassistant",
                "event": "start",
            }
        ],
        sequence: [
            {
                $smType: "condition",
                condition: 'and',
                condition_data: {
                    conditions: [
                        {
                            $smType: 'condition',
                            condition: 'numeric_state',
                            condition_data: {
                                entity_id: 'sensor.temperature_kitchen',
                                below: '15',
                            }
                        },
                        {
                            $smType: "condition",
                            condition: 'template',
                            condition_data: {
                                value_template: 'states(switch.kitchen_light) == "on"'
                            }
                        }
                    ]
                }
            },
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
        ]
    }
}


export const Complex = Template.bind({})
Complex.args = {
    ...Complex.args,
    automation: {
        tags: {
            "Room": "Bathroom",
            "For": "Toliet",
            "Type": "Smell",
            "Use": "Flushing"
        },
        metadata: {
            id: "random",
            alias: "Random",
            description: "Example Metadata",
            trigger_variables: {
                'wowo': '!'
            },
            mode: 'single',
        },
        trigger: [
            {
                "$smType": undefined,
                "platform": "numeric_state",
                "entity_id": "test",
            },
            {
                "$smType": undefined,
                "platform": "homeassistant",
                "event": "start",
            }
        ],
        sequence: [
            {
                "$smType": "condition",
                "condition": "and",
                "condition_data": {
                    "conditions": [
                        {
                            "$smType": "condition",
                            "condition": "numeric_state",
                            "condition_data": {
                                "entity_id": "sensor.temperature_kitchen",
                                "below": "15"
                            }
                        },
                        {
                            "$smType": "condition",
                            "condition": "template",
                            "condition_data": {
                                "value_template": "states(switch.kitchen_light) == \"on\""
                            }
                        }
                    ]
                }
            },
            {
                "$smType": "action",
                "action": "service",
                "action_data": {
                    "alias": "Start Music In Kitchen",
                    "service": "media_player.play_media",
                    "target": {
                        "entity_id": "media_player.kitchen_dot"
                    },
                    "data": {
                        "media_content_id": "Good Morning",
                        "media_content_type": "SPOTIFY"
                    }
                }
            },
            {
                "$smType": "action",
                "action": "choose",
                "action_data": {
                    "choose": [
                        {
                            "conditions": [
                                {
                                    "$smType": "condition",
                                    "condition": "state",
                                    "condition_data": {
                                        "entity_id": "lights.bathroom",
                                        "state": "off",
                                    }
                                }
                            ],
                            "sequence": [
                                {
                                    "$smType": "action",
                                    "action": "service",
                                    "action_data": {
                                        "service": "light.turn_on",
                                        "target": {
                                            "entity_id": "lights.bathroom"
                                        },
                                        "data": {}
                                    }
                                },
                                {
                                    "$smType": "action",
                                    "action": "service",
                                    "action_data": {
                                        "alias": "Turn off bedroom",
                                        "service": "light.turn_off",
                                        "target": {
                                            "entity_id": "lights.bedroom"
                                        },
                                        "data": {}
                                    }
                                }
                            ]
                        },
                        {
                            "conditions": [
                                {
                                    "$smType": "condition",
                                    "condition": "state",
                                    "condition_data": {
                                        "entity_id": "lights.bedroom",
                                        "state": "off",
                                    }
                                }
                            ],
                            "sequence": [
                                {
                                    "$smType": "action",
                                    "action": "service",
                                    "action_data": {
                                        "alias": "Turn on bedroom",
                                        "service": "light.turn_on",
                                        "target": {
                                            "entity_id": "lights.bedroom"
                                        },
                                        "data": {}
                                    }
                                },
                                {
                                    "$smType": "action",
                                    "action": "choose",
                                    "action_data": {
                                        "choose": [
                                            {
                                                "conditions": [],
                                                "sequence": [
                                                    {
                                                        "$smType": "action",
                                                        "action": "choose",
                                                        "action_data": {
                                                            "choose": [],
                                                            "default": [],
                                                        }
                                                    }
                                                ]
                                            }
                                        ],
                                        "default": [
                                            {
                                                "$smType": "action",
                                                "action": "choose",
                                                "action_data": {
                                                    "choose": [],
                                                    "default": [],
                                                }
                                            }
                                        ],
                                    }
                                }
                            ]
                        }
                    ],
                    "default": [
                        {
                            "$smType": "action",
                            "action": "service",
                            "action_data": {
                                "service": "light.turn_off",
                                "target": {
                                    "entity_id": "lights.bathroom"
                                },
                                "data": {}
                            }
                        }
                    ]
                }
            }
        ]
    }
}

export const EmptyStart = Template.bind({})
EmptyStart.args = {
    ...EmptyStart.args,
    automation: {
        tags: {},
        metadata: {
            id: "random",
            alias: "Random",
            description: "Example Metadata",
            trigger_variables: {
                'wowo': '!'
            },
            mode: 'single',
        },
        trigger: [
        ],
        sequence: []
    }
}
