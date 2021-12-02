
import {convertTimeToString, getDescriptionFromAutomationNode} from "./formatting";

test('converting time to a string', () => {
    expect(convertTimeToString({hours: 1})).toEqual('01:00:00:00')
    expect(convertTimeToString({hours: 1, minutes:5})).toEqual('01:05:00:00')
    expect(convertTimeToString({hours: 1, minutes:5, seconds: 24})).toEqual('01:05:24:00')
    expect(convertTimeToString({hours: 1, milliseconds: 100})).toEqual('01:00:00:100')
})

test('using alias as description', () => {
    expect(getDescriptionFromAutomationNode({
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
    })).toEqual("Start Music In Kitchen")
})


test('get service action description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: "action",
        action: "service",
        action_data: {
            service: 'media_player.play_media',
            target: {
                entity_id: "media_player.kitchen_dot"
            },
            data: {
                media_content_id: "Good Morning",
                media_content_type: "SPOTIFY",
            }
        }
    })).toEqual("media_player.play_media")
})

test('get repeat action description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: "action",
        action: "repeat",
        action_data: {
            repeat: {
                count: 10,
                sequence: []
            }
        }
    })).toEqual("Repeat 10")
})


test('get wait action description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: "action",
        action: "wait",
        action_data: {
            wait_template: "states(switch.kitchen_light) == 'on'"
        }
    })).toEqual("Wait on states(switch.kitchen_light) == 'on'")
    expect(getDescriptionFromAutomationNode({
        $smType: "action",
        action: "wait",
        action_data: {
            wait_template: "states(switch.kitchen_light) == 'on'",
            // timeout: '00:01:00',
            timeout: {
                'minutes': 1,
            }
        }
    })).toEqual("Wait on states(switch.kitchen_light) == 'on' for 00:01:00:00")
})

test('get fire event action description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: 'action',
        action: 'event',
        action_data: {
            event: 'test_event',
            event_data: {},
        }
    })).toEqual("Trigger test_event")
})

test('get device action description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: 'action',
        action: 'device',
        action_data: {
            device_id: "12310das01231",
            domain: "zwave_js",
            type: "set_value"
        }

    })).toEqual("set_value on 12310das01231")
})

test('get choose action description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: 'action',
        action: 'choose',
        action_data: {
            choose: [],
            default: [],
        }
    })).toEqual("Choose")
})

test('get and/or/not condition description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'and',
        condition_data: {
            conditions: [],
        }
    })).toEqual("Logic")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'or',
        condition_data: {
            conditions: [],
        }
    })).toEqual("Logic")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'not',
        condition_data: {
            conditions: [],
        }
    })).toEqual("Logic")
})

test('get Numeric State condition description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'numeric_state',
        condition_data: {
            entity_id: 'sensor.temperature',
        }
    })).toEqual("sensor.temperature?>?<")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'numeric_state',
        condition_data: {
            entity_id: ""
        }
    })).toEqual("Numeric State Condition")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: "numeric_state",
        condition_data: {
            entity_id: 'sensor.temperature',
            above: '17',
        }
    })).toEqual("sensor.temperature > 17")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'numeric_state',
        condition_data: {
            entity_id: 'sensor.temperature',
            below: '5',
        }
    })).toEqual("sensor.temperature < 5")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'numeric_state',
        condition_data: {
            entity_id: 'sensor.temperature',
            above: '17',
            below: '20',
        }
    })).toEqual("17 < sensor.temperature < 20")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'numeric_state',
        condition_data: {
        entity_id: 'sensor.temperature',
            above: '17',
            below: '20',
            value_template: "{{ float(state.state) + 2 }}"
        }
    })).toEqual("17 < sensor.temperature < 20")
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'numeric_state',
        condition_data: {
            entity_id: [
                "sensor.kitchen_temperature",
                "sensor.living_room_temperature"
            ],
            above: '17',
            below: '20',
            value_template: "{{ float(state.state) + 2 }}"
        }
    })).toEqual("17 < ... < 20")
})

test('get State condition description', () => {
    expect(getDescriptionFromAutomationNode({
        $smType: 'condition',
        condition: 'state',
        condition_data: {
            entity_id: 'switch.kitchen_light',
            state: "on"
        }
    })).toEqual("switch.kitchen_light is 'on'")
})
