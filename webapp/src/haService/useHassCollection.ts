import { Collection, Connection } from "home-assistant-js-websocket";
import { useState, useEffect, useMemo } from "react";
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
  const [state, setState] = useState<_HACollectionState<T>>({
    ready: false,
  });
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
  }, [conn]);

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
