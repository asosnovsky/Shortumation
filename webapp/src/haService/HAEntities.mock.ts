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
        collection: {
          state: {},
          refresh: () => new Promise(() => {}),
          subscribe: () => () => {},
        },
      },
      {
        additional: {},
        ready: false,
        collection: {
          state: {},
          refresh: () => new Promise(() => {}),
          subscribe: () => () => {},
        },
      }
    );
  } else {
    return createHAEntitiesState(
      {
        additional: {},
        ready: true,
        collection: {
          state: args.entities,
          refresh: () => new Promise(() => {}),
          subscribe: () => () => {},
        },
      },
      {
        additional: {},
        ready: true,
        collection: {
          state: args.entitySource,
          refresh: () => new Promise(() => {}),
          subscribe: () => () => {},
        },
      }
    );
  }
};
