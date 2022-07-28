import { makeStory } from "devUtils";
import { useMockApiService } from "apiService";
import { AutomationManager } from ".";
import {
  MockHAEntitiesProps,
  useMockHAEntities,
} from "haService/HAEntities.mock";
import { AutomationData } from "types/automations";
import { createMockAuto } from "utils/mocks";

const { make, componentMeta } = makeStory({
  Component: (args: {
    automations?: AutomationData[];
    haProps: MockHAEntitiesProps;
  }) => (
    <AutomationManager
      api={useMockApiService(args.automations ?? [], !args.automations)}
      haEntites={useMockHAEntities(args.haProps)}
    />
  ),
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
export const Errored = make({
  automations: undefined,
  haProps: {
    loading: false,
    entities: {},
    entitySource: {},
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
