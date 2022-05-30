import { Collection, Connection } from "home-assistant-js-websocket";
import { useState, useEffect } from 'react';
import { useHAConnection } from "./connection";

export type HACollectionState<T> = {
    ready: false,
    collection?: Collection<T>,
} | {
    ready: true,
    collection: Collection<T>,
}
export const useHassCollection = <T, D extends {} = {}>(
    getHACollection: (c: Connection) => Collection<T>,
    updateAdditionalProps?: (n: T | {}) => D,
) => {
    const [state, setState] = useState<HACollectionState<T>>({
        ready: false
    });
    const conn = useHAConnection();

    useEffect(() => {
        if (conn.status === 'loaded' && !state.ready) {
            const collection = getHACollection(conn.connection);
            setState({
                ready: false,
                collection,
            })
            const unsub = collection.subscribe(d => {
                if (d && !state.ready) {
                    setState({
                        ready: true,
                        collection,
                    })
                    unsub();
                } else if (!d && state.ready) {
                    setState({
                        ready: true,
                        collection,
                    })
                    unsub();
                }
            });
            return unsub
        }
    }, [conn, getHACollection, state.ready]);

    return {
        ...state,
        get additional(): Partial<D> {
            if (state.ready && updateAdditionalProps) {
                return updateAdditionalProps(state.collection.state)
            }
            return {}
        }
    }
} 