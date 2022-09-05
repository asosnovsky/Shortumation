import React, { FC, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Page } from "components/Page";
import { DAGGraphBoard } from "components/DAGGraph/board";
import { useAutomationNodes } from "./index";
import { useHA } from "services/ha";
import { AutomationActionData } from "types/automations";
import { createUpdaterFromAutomationData } from "../updater";
import { ModalState } from "../board/types";
import { DEFAULT_DIMS } from "./constants";
import { makeStory } from "devUtils";

const { make, componentMeta } = makeStory({
  Component: (props: {
    automation: AutomationActionData;
    flipped: boolean;
  }) => {
    const { namer } = useHA();
    const [state, setState] = useState<AutomationActionData>(props.automation);
    const [modalState, setModalState] =
      useState<ModalState | undefined>(undefined);
    const updater = createUpdaterFromAutomationData(
      setModalState,
      state,
      setState
    );
    const elementData = useAutomationNodes(state, {
      dims: {
        ...DEFAULT_DIMS,
        flipped: props.flipped,
      },
      namer,
      openModal: setModalState,
      stateUpdater: updater,
    });
    return (
      <DAGGraphBoard
        modalState={modalState}
        closeModal={() => setModalState(undefined)}
        state={{
          ready: true,
          data: {
            elements: elementData,
          },
        }}
      />
    );
  },
  meta: {
    title: "DAGGraph/Elements",
    args: {
      flipped: true,
      automation: {
        trigger: [],
        condition: [],
        action: [],
      },
    },
  },
});

export default componentMeta;

export const Empty = make({});
export const Trigger = make({
  automation: {
    trigger: [
      { platform: "homeassistant", event: "up" },
      {
        platform: "tag",
        tag_id: "Test Me",
        device_id: "testme",
        enabled: false,
      },
    ],
    condition: [],
    action: [],
  },
});

export const Conditions = make({
  automation: {
    trigger: [
      {
        platform: "zone",
        zone: "zone.home",
        event: "enter",
        entity_id: "person.ari",
      },
    ],
    condition: [
      {
        condition: "and",
        conditions: [
          {
            condition: "numeric_state",
            entity_id: "sensor.temperature_kitchen",
            below: "15",
          },
          {
            condition: "template",
            value_template: 'states(switch.kitchen_light) == "on"',
          },
        ],
      },

      {
        condition: "numeric_state",
        entity_id: "sensor.temperature_kitchen",
        below: "15",
      },
    ],
    action: [],
  },
});

export const FullAuto = make({
  automation: {
    condition: [
      {
        condition: "and",
        conditions: [
          {
            condition: "numeric_state",
            entity_id: "sensor.temperature_kitchen",
            below: "15",
          },
          {
            condition: "template",
            value_template: 'states(switch.kitchen_light) == "on"',
          },
        ],
      },

      {
        condition: "numeric_state",
        entity_id: "sensor.temperature_kitchen",
        below: "15",
      },
    ],
    trigger: [
      {
        platform: "numeric_state",
        entity_id: "test",
      },
      {
        platform: "homeassistant",
        event: "start",
      },
      {
        bad: "node",
      } as any,
    ],
    action: [
      {
        condition: "and",
        conditions: [
          {
            condition: "numeric_state",
            entity_id: "sensor.temperature_kitchen",
            below: "15",
          },
          {
            condition: "template",
            value_template: 'states(switch.kitchen_light) == "on"',
          },
        ],
      },
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
      {
        alias: "Bad Node",
      },
      {
        choose: [
          {
            conditions: [
              {
                condition: "state",
                entity_id: "lights.bathroom",
                state: "off",
              },
            ],
            sequence: [
              {
                service: "light.turn_on",
                target: {
                  entity_id: "lights.bathroom",
                },
                data: {},
              },
              {
                alias: "Turn off bedroom",
                service: "light.turn_off",
                target: {
                  entity_id: "lights.bedroom",
                },
                data: {},
              },
            ],
          },
          {
            conditions: [
              {
                condition: "state",
                entity_id: "lights.bedroom",
                state: "off",
              },
            ],
            sequence: [
              {
                alias: "Turn on bedroom",
                service: "light.turn_on",
                target: {
                  entity_id: "lights.bedroom",
                },
                data: {},
              },
              {
                choose: [
                  {
                    conditions: [],
                    sequence: [
                      {
                        choose: [],
                        default: [],
                      },
                    ],
                  },
                ],
                default: [
                  {
                    choose: [],
                    default: [],
                  },
                ],
              },
            ],
          },
        ],
        default: [
          {
            service: "light.turn_off",
            target: {
              entity_id: "lights.bathroom",
            },
            data: {},
          },
        ],
      },
      {
        condition: "and",
        conditions: [],
      },
    ],
  },
});

export const ChooseAuto = make({
  automation: {
    condition: [],
    trigger: [],
    action: [
      {
        choose: [
          {
            conditions: [
              {
                condition: "state",
                entity_id: "lights.bathroom",
                state: "off",
              },
            ],
            sequence: [
              {
                service: "light.turn_on",
                target: {
                  entity_id: "lights.bathroom",
                },
                data: {},
              },
              {
                alias: "Turn off bedroom",
                service: "light.turn_off",
                target: {
                  entity_id: "lights.bedroom",
                },
                data: {},
              },
            ],
          },
          {
            conditions: [
              {
                condition: "state",
                entity_id: "lights.bedroom",
                state: "off",
              },
            ],
            sequence: [
              {
                alias: "Turn on bedroom",
                service: "light.turn_on",
                target: {
                  entity_id: "lights.bedroom",
                },
                data: {},
              },
              {
                choose: [
                  {
                    conditions: [],
                    sequence: [
                      {
                        choose: [],
                        default: [],
                      },
                    ],
                  },
                ],
                default: [
                  {
                    choose: [],
                    default: [],
                  },
                ],
              },
            ],
          },
        ],
        default: [
          {
            service: "light.turn_off",
            target: {
              entity_id: "lights.bathroom",
            },
            data: {},
          },
        ],
      },
      {
        choose: [],
        default: [],
      },
      {
        service: "switch.turn_on",
        target: {
          entity_id: "switch.light_balcony",
        },
      },
    ],
  },
});

export const EmptyChooseAuto = make({
  automation: {
    condition: [],
    trigger: [],
    action: [
      {
        choose: [],
        default: [],
      },
    ],
  },
});

export const RepeatAuto = make({
  automation: {
    condition: [],
    trigger: [],
    action: [
      {
        repeat: {
          while: 'states(lights.switch) == "on"',
          sequence: [
            {
              delay: {
                minutes: 5,
              },
            },
          ],
        },
      },
      {
        repeat: {
          until: [
            {
              condition: "state",
              entity_id: "lights.bathroom",
              state: "off",
            },
          ],
          sequence: [
            {
              entity_id: "button.ping_mainboard",
              service: "button.pres",
            },
          ],
        },
      },
      {
        repeat: {
          count: 2,
          sequence: [
            {
              entity_id: "button.ping_mainboard",
              service: "button.pres",
            },
          ],
        },
      },
    ],
  },
});

export const ParallelAuto = make({
  automation: {
    condition: [],
    trigger: [],
    action: [
      {
        parallel: [
          {
            sequence: [
              {
                delay: {
                  hours: 1,
                },
              },
              {
                service: "light.turn_on",
              },
            ],
          },
          {
            service: "light.turn_off",
          },
        ],
      },
    ],
  },
});

export const BadNodes = make({
  automation: {
    condition: [
      {
        event: "triggerme",
      },
      {
        condition: "and",
        thisshouldnotbehere: "1",
        conditions: "1234",
      },
    ] as any,
    trigger: [
      { platform: "homeassistant" },
      { platfom: "bobid" },
      { condition: "and" },
      "text?",
    ] as any,
    action: [
      {
        parallel: {
          bad: "me",
        },
      },
      {
        platform: "event",
      },
    ] as any,
  },
});

export const IfElseNode = make({
  automation: {
    condition: [],
    trigger: [],
    action: [
      {
        if: [],
        else: [],
        then: [],
      },
    ],
  },
});

export const TimeNodes = make({
  automation: {
    condition: [],
    trigger: [
      {
        platform: "time",
        at: "",
      },
      {
        platform: "time_pattern",
      },
    ],
    action: [
      {
        condition: "time",
      },
    ],
  },
});
