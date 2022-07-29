import { createHAEntitiesState } from "./HAEntities";
import { EntitySource } from "./types";
import { HassEntities } from "home-assistant-js-websocket";

export type MockHAEntitiesProps =
  | {
      loading: true;
    }
  | {
      loading: false;
      entities: HassEntities;
      entitySource: Record<string, EntitySource>;
    };
export const useMockHAEntities = (args: MockHAEntitiesProps) => {
  if (args.loading) {
    return createHAEntitiesState(
      {
        additional: {},
        ready: false,
      },
      {
        additional: {},
        ready: false,
      }
    );
  } else {
    return createHAEntitiesState(
      {
        additional: {},
        ready: true,
        collection: args.entities,
      },
      {
        additional: {},
        ready: true,
        collection: args.entitySource,
      }
    );
  }
};
