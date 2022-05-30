import { useState } from 'react';
import {
    getAuth,
    createConnection,
    ERR_HASS_HOST_REQUIRED,
    createLongLivedTokenAuth,
    Auth,
    Connection,
} from "home-assistant-js-websocket";
import { useDelayEffect } from 'utils/useDelay';

const HASS_URL = process.env.REACT_APP_HASS_URL as string;
const HASS_TOKEN = process.env.REACT_APP_HASS_TOKEN;
export type HAConnection = {
    status: 'loading'
} | {
    status: 'loaded',
    connection: Connection,
} | {
    status: 'error',
    error: any,
};
let haConnection: HAConnection = {
    status: 'loading',
};

const createAuth = async () => {
    console.log("detecting auth")
    let auth: Auth
    if (HASS_TOKEN) {
        console.log("trying token")
        return createLongLivedTokenAuth(HASS_URL, HASS_TOKEN);
    }
    try {
        console.log("trying to get from mem")
        auth = await getAuth();
        return auth
    } catch (err) {
        if (err !== ERR_HASS_HOST_REQUIRED) {
            throw err
        }
    }
    try {
        console.log("trying to get from url")
        auth = await getAuth({ hassUrl: HASS_URL });
        return auth
    } catch (err) {
        throw err
    }
}

async function startHAConnection() {
    try {
        const auth = await createAuth();
        const connection = await createConnection({ auth });
        haConnection = {
            status: 'loaded',
            connection,
        }
        return haConnection;
    } catch (error) {
        haConnection = {
            status: 'error',
            error,
        }
        throw error
    }
}

startHAConnection().then(console.log).catch(console.error);
export const useHAConnection = (): HAConnection => {
    const [conn, setConn] = useState<HAConnection>(haConnection);
    useDelayEffect(() => {
        if (conn.status !== haConnection.status) {
            setConn(haConnection);
        }
    }, [conn], conn.status === 'loading' ? 500 : 50000);
    return conn;
};