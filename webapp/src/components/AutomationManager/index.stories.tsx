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
  type: "button",
});
export const One = make({
  automations: [auto1],
  haProps: {
    loading: false,
    entities: {
      [`automation.${auto1.metadata.id}`]: {
        entity_id: `automation.${auto1.metadata.id}`,
        attributes: {
          id: auto1.metadata.id,
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
      [`automation.${auto1.metadata.id}`]: {
        entity_id: `automation.${auto1.metadata.id}`,
        attributes: {
          id: auto1.metadata.id,
          friendly_name: auto1.metadata.alias,
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
