import { Collection, Connection } from "home-assistant-js-websocket";
import { useState, useEffect } from "react";
import { useHAConnection } from "./connection";

type _HACollectionState<T> =
  | {
      ready: false;
      collection?: Collection<T>;
    }
  | {
      ready: true;
      collection: Collection<T>;
    };
export type HACollectionState<T, D = {}> = _HACollectionState<T> & {
  additional: Partial<D>;
};
export const useHassCollection = <T, D extends {} = {}>(
  getHACollection: (c: Connection) => Collection<T>,
  updateAdditionalProps?: (n: T | {}) => D
): HACollectionState<T, D> => {
  const [state, setState] = useState<_HACollectionState<T>>({
    ready: false,
  });
  const conn = useHAConnection();

  useEffect(() => {
    if (conn.status === "loaded" && !state.ready) {
      const collection = getHACollection(conn.connection);
      setState({
        ready: false,
        collection,
      });
      const unsub = collection.subscribe((d) => {
        console.log("updating collection", d);
        if (d && !state.ready) {
          setState({
            ready: true,
            collection,
          });
          // unsub();
        } else if (!d && state.ready) {
          setState({
            ready: true,
            collection,
          });
          // unsub();
        }
      });
      return unsub;
    }
  }, [conn, getHACollection, state.ready]);

  return {
    ...state,
    get additional(): Partial<D> {
      if (state.ready && updateAdditionalProps) {
        return updateAdditionalProps(state.collection.state);
      }
      return {};
    },
  };
};
