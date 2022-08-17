import { makeStory } from "devUtils";
import { useMockApiService } from "apiService";
import { AutomationManager } from ".";
import {
  MockHAEntitiesProps,
  useMockHAEntities,
} from "haService/HAEntities.mock";
import { AutomationData } from "types/automations";
import { createMockAuto } from "utils/mocks";
import { useState } from "react";

const { make, componentMeta } = makeStory({
  Component: (args: {
    automations?: AutomationData[];
    haProps: MockHAEntitiesProps;
  }) => {
    const [haEntities, setHAE] = useState(args.haProps);
    return (
      <AutomationManager
        api={useMockApiService(args.automations ?? [], !args.automations)}
        haEntities={useMockHAEntities(haEntities)}
        refreshAutomations={() => {}}
        triggerAutomation={() => {}}
        forceDeleteAutomation={() => {}}
        onAutomationStateChange={(eid, on) => {
          if (!haEntities.loading && !haEntities.error) {
            setHAE({
              ...haEntities,
              entities: {
                ...haEntities.entities,
                [eid]: {
                  ...haEntities.entities[eid],
                  state: on ? "on" : "off",
                },
              },
            });
          }
        }}
      />
    );
  },
  meta: {
    title: "App/AutomationManager",
    args: {
      automations: [],
      haProps: {
        loading: true,
      },
    },
  },
});

export default componentMeta;
export const Loading = make({});
export const ErroredByAPI = make({
  automations: undefined,
  haProps: {
    loading: false,
    entities: {},
    entitySource: {},
  },
});
export const ErroredByWS = make({
  automations: [],
  haProps: {
    loading: false,
    error: {
      entities: { originalError: "1", message: "Failed to connect" },
      entitySource: { originalError: "1", message: "Failed to connect" },
    },
  },
});
export const Empty = make({
  automations: [],
  haProps: {
    loading: false,
    entities: {},
    entitySource: {},
  },
});
const auto1 = createMockAuto({
  tags: { type: "button" },
});
export const One = make({
  automations: [auto1],
  haProps: {
    loading: false,
    entities: {
      [`automation.${auto1.id}`]: {
        entity_id: `automation.${auto1.id}`,
        attributes: {
          id: auto1.id,
        },
        context: { id: "", parent_id: null, user_id: null },
        last_changed: "",
        last_updated: "",
        state: "on",
      },
    },
    entitySource: {},
  },
});
export const MissingAutoInConfig = make({
  automations: [],
  haProps: {
    loading: false,
    entities: {
      [`automation.${auto1.id}`]: {
        entity_id: `automation.${auto1.id}`,
        attributes: {
          id: auto1.id,
          friendly_name: auto1.alias,
        },
        context: { id: "", parent_id: null, user_id: null },
        last_changed: "",
        last_updated: "",
        state: "on",
      },
    },
    entitySource: {},
  },
});

export const CrashingAutomations = make({
  haProps: {
    loading: false,
    entities: {},
    entitySource: {},
  },
  automations: [""] as any,
});

export const BadAutomation = make({
  haProps: {
    loading: false,
    entities: {
      [`automation.${auto1.id}`]: {
        entity_id: `automation.${auto1.id}`,
        attributes: {
          id: "test",
        },
        context: { id: "", parent_id: null, user_id: null },
        last_changed: "",
        last_updated: "",
        state: "on",
      },
    },
    entitySource: {},
  },
  automations: [
    {
      tags: {},
      id: "test",
      mode: "single",
      alias: "Light.Tank_Day",
      description: "",
      source_file: "automation.yaml",
      source_file_type: "list",
      configuration_key: "automation",
      trigger: [
        {
          platform: "sun",
          event: "sunrise",
          offset: "30",
        } as any,
        { whoAmI: "bad node is who" } as any,
      ],
      condition: [{ whoAmI: "bad node is who" } as any],
      action: [
        { scene: "scene.light_day" } as any,
        { whoAmI: "bad node is who" } as any,
        {
          service: "input_select.set_options",
          target: {
            entity_id: "input_select.tank_light_mode",
          },
          data: {
            options: "day",
          },
        },
      ],
    },
  ],
});

export const OneCrashingOneGoodAutomations = make({
  haProps: {
    loading: false,
    entities: {
      [`automation.${auto1.id}`]: {
        entity_id: `automation.${auto1.id}`,
        attributes: {
          id: auto1.id,
        },
        context: { id: "", parent_id: null, user_id: null },
        last_changed: "",
        last_updated: "",
        state: "on",
      },
      "1235": {
        entity_id: `automation.1235`,
        attributes: {
          id: "1235",
        },
        context: { id: "", parent_id: null, user_id: null },
        last_changed: "",
        last_updated: "",
        state: "on",
      },
    },
    entitySource: {},
  },
  automations: [
    auto1,
    {
      id: "1235",
      tags: {},
    } as any,
    "" as any,
  ],
});
