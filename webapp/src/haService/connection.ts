import { useState, useEffect, useRef } from 'react';
import {
    ERR_HASS_HOST_REQUIRED,
    createLongLivedTokenAuth,
    Connection,
    ERR_CANNOT_CONNECT,
    ERR_CONNECTION_LOST,
    ERR_INVALID_AUTH,
    ERR_INVALID_HTTPS_TO_HTTP,
    createConnection as _createConnection,
} from "home-assistant-js-websocket";
import { remoteDetailsAPI } from 'apiService';

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

type ReturnedToken = {
    hassURL: string;
    longToken: string
} | {
    hassURL: string;
    hassioToken: string
} | {
    error: any;
}
const getToken = async (): Promise<ReturnedToken> => {
    const data = await remoteDetailsAPI.makeCall({
        "path": "/",
        "method": "GET",
    });
    if (!data.ok) {
        return {
            error: {
                message: "Failed to get token from api.",
                originalError: data.error,
            }
        }
    }
    const hassURL = data.data.hass_url;
    const hassioToken = data.data.hassio_token;
    if (!hassioToken) {
        return {
            error: {
                message: [
                    "Missing HASSIO Token, Please make sure the token is correctly passing to the container!",
                    "Make sure the token `HASSIO_TOKEN` and `HASS_URL` are set properly."
                ].join('\n'),
            }
        }
    }
    return { hassioToken, hassURL }
}

const createConnection = async () => {
    const tokens = await getToken();
    try {
        if ('hassioToken' in tokens) {
            return _createConnection({
                auth: createLongLivedTokenAuth(tokens.hassURL, tokens.hassioToken),
            });
        }
    } catch (error) {
        // eslint-disable-next-line 
        throw {
            originalError: JSON.stringify(error),
            message: translateErrorCodes(error as any),
            tokens,
        }
    }
    throw tokens
}

async function startHAConnection() {
    let connection: Connection;
    try {
        connection = await createConnection();
    } catch (error) {
        haConnection = {
            status: 'error',
            error: {
                originalError: JSON.stringify(error),
                message: translateErrorCodes(error as any),
            }
        }
        throw error
    }
    haConnection = {
        status: 'loaded',
        connection,
    }
    return haConnection;
}

startHAConnection().then(console.log).catch(console.error);
export const useHAConnection = (): HAConnection => {
    const [conn, setConn] = useState<HAConnection>(haConnection);
    const timeID = useRef<number | undefined>(undefined);
    useEffect(() => {
        if (conn.status !== haConnection.status) {
            setConn(haConnection);
        }
        const waiter = () => {
            if (conn.status !== haConnection.status) {
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