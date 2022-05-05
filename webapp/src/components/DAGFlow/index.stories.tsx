

import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGAutomationFlow } from '.';
import { useState } from 'react';
import * as dgconst from "components/DAGSvgs/constants";


export default {
    title: 'DAGAutomationFlow/Viewer',
    component: DAGAutomationFlow,
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
} as ComponentMeta<typeof DAGAutomationFlow>

const Template: ComponentStory<typeof DAGAutomationFlow> = args => {
    const [state, setState] = useState({
        trigger: args.trigger,
        sequence: args.sequence,
    })
    console.log(state)
    return <div className="page">
        <DAGAutomationFlow
            {...args}
            {...state}
            onTriggerUpdate={trigger => {
                console.log({ trigger })
                setState({ ...state, trigger })
            }}
            onSequenceUpdate={sequence => setState({ ...state, sequence })}
        />
    </div>
}

export const Simple = Template.bind({})
Simple.args = {
    ...Simple.args,
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


export const Complex = Template.bind({})
Complex.args = {
    ...Complex.args,
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
        },
        {
            "$smType": "condition",
            "condition": "and",
            "condition_data": {
                "conditions": []
            }
        }
    ]
}

export const EmptyStart = Template.bind({})
EmptyStart.args = {
    ...EmptyStart.args,
    trigger: [
    ],
    sequence: []
}
