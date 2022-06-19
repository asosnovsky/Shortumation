import {
  convertTimeToString,
  getDescriptionFromAutomationNode,
  Namer,
  prettyName,
} from "./formatting";

const dummyNamer: Namer = {
  getDeviceName(device_id) {
    return device_id;
  },
  getServiceName(service) {
    return service;
  },
  getEntityName(entity_id, maxEntities = 1) {
    if (Array.isArray(entity_id)) {
      return entity_id.slice(0, maxEntities).join(" and ");
    } else {
      return entity_id;
    }
  },
};
test("converting time to a string", () => {
  expect(convertTimeToString({ hours: 1 })).toEqual("01:00:00:00");
  expect(convertTimeToString({ hours: 1, minutes: 5 })).toEqual("01:05:00:00");
  expect(convertTimeToString({ hours: 1, minutes: 5, seconds: 24 })).toEqual(
    "01:05:24:00"
  );
  expect(convertTimeToString({ hours: 1, milliseconds: 100 })).toEqual(
    "01:00:00:100"
  );
});

test("using alias as description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        alias: "Start Music In Kitchen",
        service: "media_player.play_media",
        target: {
          entity_id: "media_player.kitchen_dot",
        },
        data: {
          media_content_id: "Good Morning",
          media_content_type: "SPOTIFY",
        },
      },
      dummyNamer,
      false
    )
  ).toEqual("Start Music In Kitchen");
});

test("get service action description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        service: "media_player.play_media",
        target: {
          entity_id: "media_player.kitchen_dot",
        },
        data: {
          media_content_id: "Good Morning",
          media_content_type: "SPOTIFY",
        },
      },
      dummyNamer,
      false
    )
  ).toEqual("media_player.play_media");
});

test("get repeat action description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        repeat: {
          count: 10,
          sequence: [],
        },
      },
      dummyNamer,
      false
    )
  ).toEqual("Repeat 10");
});

test("get wait action description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        wait_template: "states(switch.kitchen_light) == 'on'",
      },
      dummyNamer,
      false
    )
  ).toEqual("Wait on states(switch.kitchen_light) == 'on'");
  expect(
    getDescriptionFromAutomationNode(
      {
        wait_template: "states(switch.kitchen_light) == 'on'",
        timeout: {
          minutes: 1,
        },
      },
      dummyNamer,
      false
    )
  ).toEqual("Wait on states(switch.kitchen_light) == 'on' for 00:01:00:00");
});

test("get fire event action description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        event: "test_event",
        event_data: {},
      },
      dummyNamer,
      false
    )
  ).toEqual("Trigger test_event");
});

test("get device action description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        device_id: "12310das01231",
        domain: "zwave_js",
        type: "set_value",
      },
      dummyNamer,
      false
    )
  ).toEqual("Set Value 12310das01231");
});

test("get choose action description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        choose: [],
        default: [],
      },
      dummyNamer,
      false
    )
  ).toEqual("Choose");
});

test("get and/or/not condition description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "and",
        conditions: [],
      },
      dummyNamer,
      false
    )
  ).toEqual("Logic");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "or",
        conditions: [],
      },
      dummyNamer,
      false
    )
  ).toEqual("Logic");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "not",
        conditions: [],
      },
      dummyNamer,
      false
    )
  ).toEqual("Logic");
});

test("get Numeric State condition description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "numeric_state",
        entity_id: "sensor.temperature",
      },
      dummyNamer,
      false
    )
  ).toEqual("sensor.temperature?>?<");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "numeric_state",
        entity_id: "",
      },
      dummyNamer,
      false
    )
  ).toEqual("Numeric State Condition");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "numeric_state",
        entity_id: "sensor.temperature",
        above: "17",
      },
      dummyNamer,
      false
    )
  ).toEqual("sensor.temperature > 17");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "numeric_state",
        entity_id: "sensor.temperature",
        below: "5",
      },
      dummyNamer,
      false
    )
  ).toEqual("sensor.temperature < 5");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "numeric_state",
        entity_id: "sensor.temperature",
        above: "17",
        below: "20",
      },
      dummyNamer,
      false
    )
  ).toEqual("17 < sensor.temperature < 20");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "numeric_state",
        entity_id: "sensor.temperature",
        above: "17",
        below: "20",
        value_template: "{{ float(state.state) + 2 }}",
      },
      dummyNamer,
      false
    )
  ).toEqual("17 < sensor.temperature < 20");
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "numeric_state",
        entity_id: [
          "sensor.kitchen_temperature",
          "sensor.living_room_temperature",
        ],
        above: "17",
        below: "20",
        value_template: "{{ float(state.state) + 2 }}",
      },
      dummyNamer,
      false
    )
  ).toEqual("17 < ... < 20");
});

test("get State condition description", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        condition: "state",
        entity_id: "switch.kitchen_light",
        state: "on",
      },
      dummyNamer,
      false
    )
  ).toEqual("switch.kitchen_light is 'on'");
});

test("pretty naming", () => {
  expect(prettyName("sensor")).toEqual("Sensor");
  expect(prettyName("sensor.phone")).toEqual("Sensor Phone");
  expect(prettyName("device_tracker")).toEqual("Device Tracker");
  expect(prettyName("Baby Name")).toEqual("Baby Name");
});

test("get descrption for device triggerr", () => {
  expect(
    getDescriptionFromAutomationNode(
      {
        platform: "device",
        type: "no_motion",
        device_id: "d148a585c041a9a1b352a670d64e0c58",
        entity_id: "binary_sensor.motion_office_inv",
        domain: "binary_sensor",
      },
      dummyNamer,
      false
    )
  ).toEqual("binary_sensor.motion_office_inv No Motion");
});
