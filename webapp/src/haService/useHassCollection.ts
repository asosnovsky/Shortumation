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
export const useHassCollection = <T>(getHACollection: (c: Connection) => Collection<T>) => {
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
            return collection.subscribe(d => {
                if (d && !state.ready) {
                    setState({
                        ready: true,
                        collection,
                    })
                } else if (!d && state.ready) {
                    setState({
                        ready: true,
                        collection,
                    })
                }
            })
        }
    }, [conn, getHACollection, state.ready]);

    return state;
} 