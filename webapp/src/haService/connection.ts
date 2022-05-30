import { useState, useEffect, useRef } from 'react';
import {
    getAuth,
    createConnection,
    ERR_HASS_HOST_REQUIRED,
    createLongLivedTokenAuth,
    Auth,
    Connection,
    ERR_CANNOT_CONNECT,
    ERR_CONNECTION_LOST,
    ERR_INVALID_AUTH,
    ERR_INVALID_HTTPS_TO_HTTP,
} from "home-assistant-js-websocket";

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

const translateErrorCodes = (errorCode: number) => {
    if (errorCode === ERR_HASS_HOST_REQUIRED) {
        return "Missing HASS host"
    }
    if (errorCode === ERR_CANNOT_CONNECT) {
        return "Failed to connect"
    }
    if (errorCode === ERR_CONNECTION_LOST) {
        return "Connection Lost"
    }
    if (errorCode === ERR_INVALID_AUTH) {
        return "Invalid Host"
    }
    if (errorCode === ERR_INVALID_HTTPS_TO_HTTP) {
        return "Invalid https to http"
    }
    return errorCode;
}

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
            error: translateErrorCodes(error),
        }
        throw error
    }
}

startHAConnection().then(console.log).catch(console.error);
export const useHAConnection = (): HAConnection => {
    const [conn, setConn] = useState<HAConnection>(haConnection);
    const timeID = useRef<number | undefined>(undefined);
    console.log("connecting to HA")
    useEffect(() => {
        console.log('connection state', conn.status)
        if (conn.status !== haConnection.status) {
            setConn(haConnection);
        }
        const waiter = () => {
            if (conn.status !== haConnection.status) {
                console.log('setting status', conn.status, haConnection.status)
                setConn(haConnection);
            }
            timeID.current = window.setTimeout(() => {
                waiter()
            }, conn.status === 'loading' ? 500 : 5000)
        }
        waiter()
        return () => window.clearTimeout(timeID.current)
    }, [conn, setConn])
    return conn;
};