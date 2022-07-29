import { createHAEntitiesState } from "./HAEntities";
import { EntitySource } from "./types";
import { HassEntities } from "home-assistant-js-websocket";

export type MockHAEntitiesProps =
  | {
      loading: true;
    }
  | {
      loading: false;
      error?: false;
      entities: HassEntities;
      entitySource: Record<string, EntitySource>;
    }
  | {
      loading: false;
      error: {
        entities: any;
        entitySource: any;
      };
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
  } else if (!args.error) {
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
  } else {
    return createHAEntitiesState(
      {
        additional: {},
        ready: false,
        error: args.error.entities,
      },
      {
        additional: {},
        ready: false,
        error: args.error.entitySource,
      }
    );
  }
};
