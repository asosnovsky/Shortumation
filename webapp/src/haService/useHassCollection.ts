import { Collection, Connection } from "home-assistant-js-websocket";
import { useState, useEffect, useMemo } from "react";
import { useDelayedFunction } from "utils/useDelay";
import { useHAConnection } from "./connection";

type _HACollectionState<T> =
  | {
      ready: false;
      collection?: undefined;
      error?: string;
    }
  | {
      ready: true;
      collection: T;
    };
export type HACollectionState<T, D = {}> = _HACollectionState<T> & {
  additional: Partial<D>;
};
export const useHassCollection = <T, D extends {} = {}>(
  getHACollection: (c: Connection) => Collection<T>,
  updateAdditionalProps?: (n: T | {}) => D
): HACollectionState<T, D> => {
  const [state, _setState] = useState<_HACollectionState<T>>({
    ready: false,
  });
  const setState = useDelayedFunction(_setState, 500);
  const conn = useHAConnection();
  const collection = useMemo(() => {
    if (conn.status === "loaded") {
      return getHACollection(conn.connection);
    }
  }, [conn, getHACollection]);

  useEffect(() => {
    if (collection) {
      if (collection.state) {
        setState({
          ready: true,
          collection: collection.state,
        });
      }
      const unsub = collection.subscribe((d) => {
        if (d) {
          console.log(
            "updating with",
            Object.keys(d).length,
            Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v.state])),
            getHACollection
          );
          setState({
            ready: true,
            collection: d,
          });
        }
      });
      return () => {
        unsub();
      };
    }
    // eslint-disable-next-line
  }, [collection, state.ready]);

  useEffect(() => {
    if (conn.status === "error") {
      if (!state.ready && conn.error !== state.error) {
        setState({
          ready: false,
          error: conn.error,
        });
      }
    }
    // eslint-disable-next-line
  }, [conn, state]);

  if (state.ready) {
    if (!state.collection) {
      throw Error("What?");
    }
  }

  return {
    ...state,
    get additional(): Partial<D> {
      if (state.ready && updateAdditionalProps) {
        return updateAdditionalProps(state.collection ?? {});
      }
      return {};
    },
  };
};
