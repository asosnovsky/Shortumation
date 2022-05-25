

import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGAutomationFlow } from '.';
import { useState } from 'react';
import * as dgconst from "components/DAGFlow/constants";
import { Page } from "components/Page";


export default {
    title: 'DAGAutomationFlow/Viewer',
    component: DAGAutomationFlow,
    parameters: { actions: { argTypesRegex: '^on.*' } },
    args: {
        dims: dgconst.DEFAULT_DIMS
    }
} as ComponentMeta<typeof DAGAutomationFlow>

const Template: ComponentStory<typeof DAGAutomationFlow> = args => {
    const [state, setState] = useState({
        trigger: args.trigger,
        sequence: args.sequence,
        condition: args.condition,
    })
    return <Page>
        <DAGAutomationFlow
            {...args}
            {...state}
            onTriggerUpdate={trigger => {
                setState({ ...state, trigger })
            }}
            onSequenceUpdate={sequence => setState({ ...state, sequence })}
            onConditionUpdate={condition => setState({ ...state, condition })}
        />
    </Page>
}

export const Simple = Template.bind({})
Simple.args = {
    ...Simple.args,
    condition: [],
    trigger: [
        {
            "platform": "numeric_state",
            "entity_id": "test",
        },
        {
            "platform": "homeassistant",
            "event": "start",
        }
    ],
    sequence: [
        {
            condition: 'and',
            conditions: [
                {
                    condition: 'numeric_state',
                    entity_id: 'sensor.temperature_kitchen',
                    below: '15',
                },
                {
                    condition: 'template',
                    value_template: 'states(switch.kitchen_light) == "on"'
                }
            ]
        },
        {
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
    ]
}


export const Complex = Template.bind({})
Complex.args = {
    ...Complex.args,
    condition: [],
    trigger: [
        {
            "platform": "numeric_state",
            "entity_id": "test",
        },
        {
            "platform": "homeassistant",
            "event": "start",
        }
    ],
    sequence: [
        {
            "condition": "and",
            "conditions": [
                {
                    "condition": "numeric_state",
                    "entity_id": "sensor.temperature_kitchen",
                    "below": "15"
                },
                {
                    "condition": "template",
                    "value_template": "states(switch.kitchen_light) == \"on\""
                }
            ]
        },
        {
            "alias": "Start Music In Kitchen",
            "service": "media_player.play_media",
            "target": {
                "entity_id": "media_player.kitchen_dot"
            },
            "data": {
                "media_content_id": "Good Morning",
                "media_content_type": "SPOTIFY"
            }
        },
        {
            "choose": [
                {
                    "conditions": [
                        {
                            "condition": "state",
                            "entity_id": "lights.bathroom",
                            "state": "off",
                        }
                    ],
                    "sequence": [
                        {
                            "service": "light.turn_on",
                            "target": {
                                "entity_id": "lights.bathroom"
                            },
                            "data": {}
                        },
                        {
                            "alias": "Turn off bedroom",
                            "service": "light.turn_off",
                            "target": {
                                "entity_id": "lights.bedroom"
                            },
                            "data": {}
                        }
                    ]
                },
                {
                    "conditions": [
                        {
                            "condition": "state",
                            "entity_id": "lights.bedroom",
                            "state": "off",
                        }
                    ],
                    "sequence": [
                        {
                            "alias": "Turn on bedroom",
                            "service": "light.turn_on",
                            "target": {
                                "entity_id": "lights.bedroom"
                            },
                            "data": {}
                        },
                        {
                            "choose": [
                                {
                                    "conditions": [],
                                    "sequence": [
                                        {
                                            "choose": [],
                                            "default": [],
                                        }
                                    ]
                                }
                            ],
                            "default": [
                                {
                                    "choose": [],
                                    "default": [],
                                }
                            ],
                        }
                    ]
                }
            ],
            "default": [
                {
                    "service": "light.turn_off",
                    "target": {
                        "entity_id": "lights.bathroom"
                    },
                    "data": {}
                }
            ]
        },
        {
            "condition": "and",
            "conditions": []
        }
    ]
}

export const EmptyStart = Template.bind({})
EmptyStart.args = {
    ...EmptyStart.args,
    condition: [],
    trigger: [],
    sequence: []
}


export const Errors = Template.bind({})
Errors.args = {
    ...Errors.args,
    condition: [
        {
            "condition": "numeric_state",
        } as any
    ],
    trigger: [
        {
            "platform": "event",
        } as any
    ],
    sequence: [
        {
            "choose": {}
        } as any
    ]
}